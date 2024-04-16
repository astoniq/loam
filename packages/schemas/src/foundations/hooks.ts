import {z} from "zod";

export enum HookEvent {
    PostRegister = 'PostRegister',
    PostSignIn = 'PostSignIn',
    PostResetPassword = 'PostResetPassword'
}

export const hookEventGuard: z.ZodType<HookEvent> = z.nativeEnum(HookEvent);

export const hookEventsGuard = hookEventGuard.array();

export type HookEvents = z.infer<typeof hookEventsGuard>;

export const hookConfigGuard = z.object({
    url: z.string(),
    headers: z.record(z.string()).optional(),
})

export type HookConfig = z.infer<typeof hookConfigGuard>;