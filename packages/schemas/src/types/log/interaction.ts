import {InteractionEvent} from "@/types/interactions.js";
import {MfaFactor} from "@/foundations/sign-in-experience.js";

export type Prefix = 'Interaction';

export const prefix: Prefix = 'Interaction';

export enum Field {
    Event = 'Event',
    Identifier = 'Identifier',
    Profile = 'Profile',
    BindMfa = 'BindMfa',
    Mfa = 'Mfa'
}

export enum Method {
    Password = 'Password',
    VerificationCode = 'VerificationCode',
    Social = 'Social',
    SingleSignOn = 'SingleSignOn'
}

export enum Action {
    Create = 'Create',
    Update = 'Update',
    Submit = 'Submit',
    Delete = 'Delete',
    End = 'End'
}

export type LogKey =
    | `${Prefix}.${Action.Create | Action.End}`
    | `${Prefix}.${InteractionEvent}.${Action.Update | Action.Submit}`
    | `${Prefix}.${InteractionEvent}.${Field.Profile}.${
    | Action.Update // PATCH profile
    | Action.Create // PUT profile
    | Action.Delete}`
    | `${Prefix}.${Exclude<
    InteractionEvent,
    InteractionEvent.ForgotPassword
>}.${Field.Identifier}.${Exclude<Method, Method.Password>}.${Action.Create | Action.Submit}`
    | `${Prefix}.${Exclude<
    InteractionEvent,
    InteractionEvent.ForgotPassword
>}.${Field.Identifier}.${Method.Password}.${Action.Submit}`
    | `${Prefix}.${InteractionEvent.ForgotPassword}.${Field.Identifier}.${Method.VerificationCode}.${
    | Action.Create
    | Action.Submit}`
    | `${Prefix}.${InteractionEvent}.${Field.BindMfa}.${MfaFactor}.${Action.Submit | Action.Create}`
    | `${Prefix}.${InteractionEvent.SignIn}.${Field.Mfa}.${MfaFactor}.${
    | Action.Submit
    | Action.Create}`;