import { z } from 'zod';

export type UserProfile = Partial<{
    familyName: string;
    givenName: string;
    middleName: string;
    nickname: string;
    preferredUsername: string;
    profile: string;
    website: string;
    gender: string;
    birthdate: string;
    zoneinfo: string;
    locale: string;
    address: Partial<{
        formatted: string;
        streetAddress: string;
        locality: string;
        region: string;
        postalCode: string;
        country: string;
    }>;
}>;

export const userProfileGuard = (
    z.object({
        familyName: z.string(),
        givenName: z.string(),
        middleName: z.string(),
        nickname: z.string(),
        preferredUsername: z.string(),
        profile: z.string(),
        website: z.string(),
        gender: z.string(),
        birthdate: z.string(),
        zoneinfo: z.string(),
        locale: z.string(),
        address: z
            .object({
                formatted: z.string(),
                streetAddress: z.string(),
                locality: z.string(),
                region: z.string(),
                postalCode: z.string(),
                country: z.string(),
            })
            .partial(),
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