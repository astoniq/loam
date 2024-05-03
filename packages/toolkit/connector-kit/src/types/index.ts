import {SocialConnector} from "./social.js";
import {EmailConnector, SmsConnector} from "./passwordless.js";

export * from './config-form.js';
export * from './error.js';
export * from './metadata.js';
export * from './foundation.js';
export * from './passwordless.js';
export * from './social.js';

export type GetConnectorConfig = (id: string) => Promise<unknown>;

export type AllConnector = SmsConnector | EmailConnector | SocialConnector;

export type CreateConnector<T extends AllConnector> = (options: {
    getConfig: GetConnectorConfig;
}) => Promise<T>;