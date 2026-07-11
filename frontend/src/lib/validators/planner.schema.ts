import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(8000),
});

/** Body del endpoint de chat del planner (compatible con useChat de Vercel AI SDK) */
export const plannerChatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export type PlannerChatInput = z.infer<typeof plannerChatSchema>;
