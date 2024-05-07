import {CustomClientMetadata} from "../foundations/index.js";
import {z} from 'zod'
import {inSeconds} from "./date.js";

export const customClientMetadataDefault = Object.freeze({
    idTokenTtl: inSeconds.oneHour,
    refreshTokenTtlInDays: 14,
    rotateRefreshToken: true,
} as const satisfies Partial<CustomClientMetadata>);

export enum ExtraParamsKey {
    InteractionMode = 'interaction_mode',
    FirstScreen = 'first_screen',
    DirectSignIn = 'direct_sign_in',
}

export enum InteractionMode {
    SignIn = 'signIn',
    SignUp = 'signUp',
}

export enum FirstScreen {
    SignIn = 'signIn',
    Register = 'register',
}

export const extraParamsObjectGuard = z
    .object({
        [ExtraParamsKey.InteractionMode]: z.nativeEnum(InteractionMode),
        [ExtraParamsKey.FirstScreen]: z.nativeEnum(FirstScreen),
        [ExtraParamsKey.DirectSignIn]: z.string(),
    })
    .partial();

export type ExtraParamsObject = z.infer<typeof extraParamsObjectGuard>;