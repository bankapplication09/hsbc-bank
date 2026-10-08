import { prisma } from "@/lib/db";
import { forbidden, json, readJson, requestMeta, route, tooManyRequests, unauthorized } from "@/lib/http";
import { loginSchema } from "@/lib/validation";
import { burnPasswordCheck, createSession, setSessionCookie, verifyPassword } from "@/server/auth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

export const POST = route(async (req) => {
  const input = await readJson(req, loginSchema);
  const meta = requestMeta(req);
  const since = new Date(Date.now() - WINDOW_MS);
  const fails = await prisma.loginAttempt.count({
    where: { email: input.email, success: false, createdAt: { gte: since } },
  });
  if (fails >= MAX_FAILS) throw tooManyRequests("Log on is paused for 15 minutes. Please try again shortly.");

  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordOk = user ? await verifyPassword(input.password, user.passwordHash) : false;
  if (!user) await burnPasswordCheck(input.password);

  const portal = user?.role === "ADMIN" ? "ADMIN" : "USER";
  if (!user || !passwordOk) {
    await prisma.loginAttempt.create({
      data: { email: input.email, portal, success: false, ipAddress: meta.ip, userAgent: meta.userAgent },
    });
    throw unauthorized("The email or password is incorrect");
  }
  if (user.status === "SUSPENDED") throw forbidden("This account is suspended");
  if (user.status === "LOCKED") throw forbidden("This account is locked. Reset the password to continue");
  if (user.status !== "ACTIVE") throw forbidden("This account is not active");

  if (user.role === "ADMIN" && user.twoFactorEnabled) {
    if (!input.code) return json({ needsCode: true, error: "Enter your 6-digit staff code" }, 401);
    const codeOk = user.twoFactorSecret ? await verifyPassword(input.code, user.twoFactorSecret) : false;
    if (!codeOk) {
      await prisma.loginAttempt.create({
        data: { email: input.email, portal: "ADMIN", success: false, ipAddress: meta.ip, userAgent: meta.userAgent },
      });
      throw unauthorized("The staff code is incorrect");
    }
  }

  await prisma.loginAttempt.create({
    data: { email: input.email, portal, success: true, ipAddress: meta.ip, userAgent: meta.userAgent },
  });
  const token = await createSession(user.id, portal, meta, portal === "USER" && Boolean(input.remember));
  await setSessionCookie(token, portal === "USER" && Boolean(input.remember));
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), ...(portal === "USER" ? { hideBalances: true } : {}) },
  });
  return json({ ok: true, redirect: portal === "ADMIN" ? "/admin/dashboard" : "/home" });
});
