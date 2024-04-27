import {IRouterParamContext} from "koa-router";
import {SignInExperience} from '@astoniq/loam-schemas'
import {PasswordPolicyChecker} from "@astoniq/loam-core-kit";
import {Middleware} from "koa";
import {Queries} from "@/application/queries.js";

export type WithInteractionSieContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & {signInExperience: SignInExperience, passwordPolicyChecker: PasswordPolicyChecker}

export function koaInteractionSie<StateT, ContextT extends IRouterParamContext, ResponseT>(
    {
        signInExperience: {findDefaultSignInExperience}
    }: Queries):Middleware<StateT, WithInteractionSieContext<ContextT>, ResponseT> {

    return async (ctx, next) => {
        const signInExperience = await findDefaultSignInExperience()

        // @ts-ignore
        ctx.signInExperience = signInExperience;
        ctx.passwordPolicyChecker = new PasswordPolicyChecker(
            signInExperience.passwordPolicy
        )

        return next()
    }
}