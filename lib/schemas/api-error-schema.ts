import { z } from "zod";

export const apiErrorSchema = z.object({
  detail: z.array(
    z.object({
      msg: z.string(),
    })
  ),
});

export const apiStatusError = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
});
