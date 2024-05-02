import type { ZodType } from 'zod';

import { type ConnectorMetadata } from './metadata.js';

export enum ConnectorType {
    Email = 'Email',
    Sms = 'Sms',
    Social = 'Social',
}

export type BaseConnector<Type extends ConnectorType> = {
    type: Type;
    metadata: ConnectorMetadata;
    configGuard: ZodType;
};