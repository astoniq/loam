import { z } from 'zod';

const hookExecutionStatsGuard = z.object({
    successCount: z.number(),
    requestCount: z.number(),
});

export type HookExecutionStats = z.infer<typeof hookExecutionStatsGuard>;
