import {ConnectorMetadata, SignInExperience} from "@astoniq/loam-schemas";


export type Platform = 'web' | 'mobile'

export type SignInExperienceSettings = Omit<SignInExperience, 'socialSignInConnectorTargets'> & {
    socialConnectors: ConnectorMetadata[]
}