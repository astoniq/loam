import { z } from 'zod';

export type UserProfile = Partial<{
    familyName: string;
    givenName: string;
    middleName: string;
    nickname: string;
}>;

export const userProfileGuard = (
    z.object({
        familyName: z.string(),
        givenName: z.string(),
        middleName: z.string(),
        nickname: z.string(),
    }) satisfies z.ZodType<Required<UserProfile>>
).partial();

export const userProfileKeys = Object.freeze(userProfileGuard.keyof().options);

export const roleNamesGuard = z.string().array();

export const webAuthnTransportGuard = z.enum([
    'usb',
    'nfc',
    'ble',
    'internal',
    'cable',
    'hybrid',
    'smart-card',
]);