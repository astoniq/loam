import { z } from 'zod';
import {emailRegEx} from "@astoniq/loam-core-kit";

const emailIdentifierGuard = z.string().regex(emailRegEx);
const codeGuard = z.string().min(1);

export const requestVerificationCodePayloadGuard = z.object({ email: emailIdentifierGuard });

export type RequestVerificationCodePayload = z.infer<typeof requestVerificationCodePayloadGuard>;

export const emailVerificationCodePayloadGuard = z.object({
    email: emailIdentifierGuard,
    verificationCode: codeGuard,
});
export type EmailVerificationCodePayload = z.infer<typeof emailVerificationCodePayloadGuard>;

export const verifyVerificationCodePayloadGuard = emailVerificationCodePayloadGuard;

export type VerifyVerificationCodePayload =
    | EmailVerificationCodePayload