import { z } from 'zod';
import {emailRegEx} from "@astoniq/loam-core-kit";

const emailIdentifierGuard = z.string().regex(emailRegEx);
const codeGuard = z.string().min(1);

export const verificationCodePayloadGuard = z.object({ email: emailIdentifierGuard })

export type VerificationCodePayload = z.infer<typeof verificationCodePayloadGuard>;

export const verifyVerificationCodePayloadGuard = z.object({
    email: emailIdentifierGuard,
    verificationCode: codeGuard,
});
export type VerifyVerificationCodePayload = z.infer<typeof verifyVerificationCodePayloadGuard>;
