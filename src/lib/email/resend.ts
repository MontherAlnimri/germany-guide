import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const EMAIL_FROM = process.env.EMAIL_FROM || "Germany Guide <onboarding@resend.dev>";