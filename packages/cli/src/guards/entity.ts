import {z} from "zod";

export const countEntityGuard = z.object({
    count: z.number(),
})