import { z } from 'zod';
import {BaseConnector, ConnectorType} from "./foundation.js";

export enum TemplateType {
    /** The template for sending verification code when user is signing in. */
    SignIn = 'SignIn',
    /** The template for sending verification code when user is registering. */
    Register = 'Register',
    /** The template for sending verification code when user is resetting password. */
    ForgotPassword = 'ForgotPassword',
    /** The template for generic usage. */
    Generic = 'Generic',
}

export const templateTypeGuard = z.nativeEnum(TemplateType);

export type SendMessagePayload = {
    /**
     * The dynamic verification code to send. It will replace the `{{code}}` handlebars in the
     * template.
     * @example '123456'
     */
    code?: string;
    /**
     * The dynamic link to send. It will replace the `{{link}}` handlebars in the template.
     * @example 'https://example.com'
     */
    link?: string;
} & Record<string, string>;

export const sendMessagePayloadGuard = z
    .object({
        code: z.string().optional(),
        link: z.string().optional(),
    })
    .and(z.record(z.string())) satisfies z.ZodType<SendMessagePayload>;

export const urlRegEx =
    /(https?:\/\/)?(?:www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b[\w#%&()+./:=?@~-]*/;

export const emailServiceBrandingGuard = z
    .object({
        senderName: z
            .string()
            .refine((address) => !urlRegEx.test(address), 'URL is not allowed in sender name.'),
        companyInformation: z
            .string()
            .refine((address) => !urlRegEx.test(address), 'URL is not allowed in company information.'),
        appLogo: z.string().url(),
    })
    .partial();

export type EmailServiceBranding = z.infer<typeof emailServiceBrandingGuard>;

export type SendMessageData = {
    to: string;
    type: TemplateType;
    payload: SendMessagePayload;
};

export const sendMessageDataGuard = z.object({
    to: z.string(),
    type: templateTypeGuard,
    payload: sendMessagePayloadGuard,
}) satisfies z.ZodType<SendMessageData>;

export type SendMessageFunction = (data: SendMessageData, config?: unknown) => Promise<unknown>;

export type GetUsageFunction = (startFrom?: Date) => Promise<number>;

export type SmsConnector = BaseConnector<ConnectorType.Sms> & {
    sendMessage: SendMessageFunction;
    getUsage?: GetUsageFunction;
};

export type EmailConnector = BaseConnector<ConnectorType.Email> & {
    sendMessage: SendMessageFunction;
    getUsage?: GetUsageFunction;
};