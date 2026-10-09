const USER_PREFIXES = [
  "/home",
  "/accounts",
  "/payments",
  "/transactions",
  "/statements",
  "/notifications",
  "/profile",
  "/cards",
  "/settings",
  "/insights",
  "/direct-debits",
  "/goals",
  "/rates",
  "/explore",
];

const OPEN_ADMIN = ["/admin/login", "/admin/forgot-password"];

export function isProtectedAppPath(pathname: string): boolean {
  const openAdmin =
    OPEN_ADMIN.includes(pathname) || pathname.startsWith("/admin/reset-password");
  if (pathname.startsWith("/admin") && !openAdmin) return true;
  return USER_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
