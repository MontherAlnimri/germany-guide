export * from "./database";

export interface ActionResponse<T = null> { success: boolean; data?: T; error?: string; }
export interface NavItem { label: string; href: string; icon?: string; badge?: string | number; }
export type TranslationKey = string;
