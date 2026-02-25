import { format, formatDistanceToNow, differenceInDays, isPast, isToday, parseISO } from "date-fns";
type DocumentStatus = 'valid' | 'pending' | 'expired' | 'notUploaded';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "\u2014";
  try { return format(parseISO(dateStr), "MMM d, yyyy"); }
  catch { return dateStr; }
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "\u2014";
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); }
  catch { return dateStr; }
}

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  try { return differenceInDays(parseISO(dateStr), new Date()); }
  catch { return null; }
}

export function isDatePast(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  try { return isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr)); }
  catch { return false; }
}

export function computeDocumentStatus(expiryDate: string | null | undefined, currentStatus?: DocumentStatus): DocumentStatus {
  if (!expiryDate) return currentStatus || "notUploaded";
  const days = daysUntil(expiryDate);
  if (days === null) return currentStatus || "notUploaded";
  if (days < 0) return "expired";
  if (days <= 30) return "expired";
  return "valid";
}

export function todayISO(): string { return format(new Date(), "yyyy-MM-dd"); }
export function truncate(text: string, maxLen: number): string { return text.length <= maxLen ? text : text.slice(0, maxLen - 3) + "..."; }
export function capitalize(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1); }
export function formatPercent(value: number): string { return Math.round(value) + "%"; }
