import { z } from 'zod';

export const roleNamesGuard = z.string().array();

export const webAuthnTransportGuard = z.enum([
    'usb',
    'nfc',
    'ble',
    'internal',
    'cable',
    'hybrid',
    'smart-card',
]);