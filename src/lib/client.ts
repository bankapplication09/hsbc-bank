export class ApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;
  status: number;
  needsCode?: boolean;

  constructor(status: number, message: string, extras?: { fieldErrors?: Record<string, string[] | undefined>; needsCode?: boolean }) {
    super(message);
    this.status = status;
    this.fieldErrors = extras?.fieldErrors;
    this.needsCode = extras?.needsCode;
  }
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
    needsCode?: boolean;
  } & T;
  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? "Something went wrong", {
      fieldErrors: data.fieldErrors,
      needsCode: data.needsCode,
    });
  }
  return data;
}
