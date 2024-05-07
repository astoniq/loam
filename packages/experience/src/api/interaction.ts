import api from './api';
import {InteractionEvent, SignInIdentifier} from "@astoniq/loam-schemas";

export const interactionPrefix = '/api/interaction'

type Response = {
    redirectTo: string
}

export type PasswordSignInPayload = { [K in SignInIdentifier]?: string} & {password: string};

export const signInWithPasswordIdentifier = async (payload: PasswordSignInPayload) => {
    await api.put(interactionPrefix, {
        json: {
            event: InteractionEvent.SignIn,
            identifier: payload
        }
    });

    return api.post(`${interactionPrefix}/submit`).json<Response>()
}



