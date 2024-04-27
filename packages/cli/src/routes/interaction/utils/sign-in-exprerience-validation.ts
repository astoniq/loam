import {
    IdentifierPayload,
    InteractionEvent, Profile,
    SignInExperience,
    SignInIdentifier,
    SignInMode
} from "@astoniq/loam-schemas";
import assertThat from "@/utils/assert-that.js";
import {RequestError} from "@/errors/index.js";

const forbiddenIdentifierError = () =>
    new RequestError({
        code: 'user.sign_in_method_not_enabled',
        status: 422
    })


export const verifySignInModeSettings = (
    event: InteractionEvent,
    {signInMode}: SignInExperience
) => {
    if (event === InteractionEvent.SignIn) {
        assertThat(signInMode !== SignInMode.Register, forbiddenIdentifierError())
    }

    if (event === InteractionEvent.Register) {
        assertThat(signInMode !== SignInMode.SignIn, forbiddenIdentifierError())
    }
}

export const verifyIdentifierSettings = (
    identifier: IdentifierPayload,
    signInExperience: SignInExperience
) => {

    const {signIn, signUp} = signInExperience

    if ('connectorId' in identifier) {
        return;
    }

    if ('email' in identifier) {
        assertThat(
            signIn.methods.some(({identifier: method, password, verificationCode}) => {
                if (method !== SignInIdentifier.Email) {
                    return false
                }

                if ('password' in identifier && !password) {
                    return false
                }

                return !('verificationCode' in identifier &&
                    !verificationCode &&
                    !signUp.identifiers.includes(SignInIdentifier.Email) &&
                    !signUp.verify);
            }),
            forbiddenIdentifierError()
        )
    }
}

export const verifyProfileSettings = (profile: Profile, {signUp}: SignInExperience) => {
    if (profile.email) {
        assertThat(signUp.identifiers.includes(SignInIdentifier.Email), forbiddenIdentifierError())
    }

    if (profile.password) {
        assertThat(signUp.password, forbiddenIdentifierError())
    }
}