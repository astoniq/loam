import type * as hook from './hook.js';
import type * as interaction from './interaction.js';
import type * as token from './token.js';

export * as interaction from './interaction.js';
export * as token from './token.js';
export * as hook from './hook.js';

export const LogKeyUnknown = 'Unknown';

export type AuditLogKey = typeof LogKeyUnknown | interaction.LogKey | token.LogKey;
export type WebhookLogKey = hook.LogKey;

export type LogKey = AuditLogKey | WebhookLogKey;