import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const saveTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        type: z.enum(["text", "voice", "image", "document", "conversation"]).default("text"),
        source_lang: z.string().max(10),
        target_lang: z.string().max(10),
        source_text: z.string().min(1).max(20000),
        translated_text: z.string().min(1).max(20000),
        tone: z.string().max(40).optional(),
        starred: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("translations")
      .insert({
        user_id: userId,
        type: data.type,
        source_lang: data.source_lang,
        target_lang: data.target_lang,
        source_text: data.source_text,
        translated_text: data.translated_text,
        tone: data.tone ?? null,
        starred: data.starred,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listTranslations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("translations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data;
  });

export const toggleStar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), starred: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("translations")
      .update({ starred: data.starred })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("translations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
