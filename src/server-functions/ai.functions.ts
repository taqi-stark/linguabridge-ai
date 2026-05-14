import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY =
  process.env.AI_BASE_URL ||
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const langName = (code: string) => {
  const map: Record<string, string> = {
    auto: "auto-detect",
    en: "English",
    it: "Italian",
    ur: "Urdu",
  };
  return map[code] ?? code;
};

import { supabaseAdmin } from "@/integrations/supabase/client.server";

// DATABASE-BACKED QUOTA
async function enforceLimit(uid: string, type: "image" | "document") {
  if (uid === "anon") throw new Error("Login required to use this AI service.");

  if (!supabaseAdmin || !(supabaseAdmin as any).from) {
    console.warn("Skipping quota enforcement: no Supabase service role key found.");
    return;
  }

  const limits =
    type === "image" ? { limit: 15, col: "image_count" } : { limit: 50, col: "document_count" };
  const { data: q, error: checkErr } = await (supabaseAdmin as any)
    .from("user_quotas")
    .select("*")
    .eq("user_id", uid)
    .single();
  const now = new Date();

  if (checkErr && checkErr.code === "PGRST116") {
    await (supabaseAdmin as any).from("user_quotas").insert({
      user_id: uid,
      [limits.col]: 1,
      reset_at: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
    });
    return;
  }
  if (!q) return;
  const resetTime = new Date(q.reset_at).getTime();
  if (now.getTime() > resetTime) {
    await (supabaseAdmin as any)
      .from("user_quotas")
      .update({
        image_count: type === "image" ? 1 : 0,
        document_count: type === "document" ? 1 : 0,
        reset_at: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      })
      .eq("user_id", uid);
    return;
  }
  if (q[limits.col] >= limits.limit) {
    throw new Error(
      `Daily ${type} limits reached (${limits.limit}/${limits.limit}). Upgrade your plan.`,
    );
  }
  await (supabaseAdmin as any)
    .from("user_quotas")
    .update({ [limits.col]: q[limits.col] + 1 })
    .eq("user_id", uid);
}

class AIProviderManager {
  static get openAIKey() {
    return process.env.OPENAI_API_KEY;
  }
  static get deepLKey() {
    return process.env.DEEPL_API_KEY;
  }

  static get geminiKeys() {
    return (process.env.GEMINI_API_KEY || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  static get geminiKey() {
    if (this.geminiKeys.length === 0) return undefined;
    return this.geminiKeys[Math.floor(Math.random() * this.geminiKeys.length)];
  }

  static rotateGemini() {
    console.log("ROTATING GEMINI API KEY POOL -> (Stateless random selection enabled)");
  }

  static async callGemini(body: any) {
    if (!this.geminiKey) throw new Error("Gemini API key missing");
    const uri =
      process.env.AI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const res = await fetch(uri, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.geminiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemini-3-flash-preview", ...body }),
    });
    if (res.status === 429) {
      this.rotateGemini();
      throw new Error("RATE_LIMIT");
    }
    if (!res.ok) throw new Error(`Gemini err: ${await res.text()}`);
    return res.json();
  }

  static async callOpenAI(body: any) {
    if (!this.openAIKey) throw new Error("OpenAI API key missing");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.openAIKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", ...body }),
    });
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (!res.ok) throw new Error(`OpenAI err: ${await res.text()}`);
    return res.json();
  }

  static async route(
    body: any,
    tier: "low-cost" | "premium" = "low-cost",
    attempts = 0,
  ): Promise<any> {
    if (attempts > 3)
      throw new Error("All API Key rotations failed. Quota limits completely exhausted.");
    try {
      if (tier === "premium" && this.openAIKey) {
        return await this.callOpenAI(body);
      }
      if (this.geminiKey) return await this.callGemini(body);
      if (this.openAIKey) return await this.callOpenAI(body);
      throw new Error("No providers available. Check API keys.");
    } catch (e: any) {
      if (e.message === "RATE_LIMIT") {
        return await this.route(body, tier, attempts + 1);
      }
      console.warn("Provider failed, engaging fallback...", e.message);
      if (this.geminiKey && tier === "premium") return await this.callGemini(body);
      throw e;
    }
  }
}

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        text: z.string().min(1).max(5000),
        source: z.string().min(1).max(10),
        target: z.string().min(1).max(10),
        tone: z.enum(["neutral", "formal", "casual", "academic"]).default("neutral"),
        wantTransliteration: z.boolean().default(false),
        glossary: z.string().optional(),
        contextType: z.enum(["text", "document"]).default("text"),
        userId: z.string().optional().default("anon"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.contextType === "document") await enforceLimit(data.userId, "document");

    // Advanced Placeholder Sanitization Algorithm
    let safeText = data.text;
    const placeholders: string[] = [];
    safeText = safeText.replace(/(\{\{.*?\}\}|\{.*?\}|\[.*?\]|<.*?>)/g, (match) => {
      placeholders.push(match);
      return `__VAR_${placeholders.length - 1}__`;
    });

    const sys = `You are an expert translator for English, Italian, and Urdu. Always return JSON via the provided tool.`;
    let user = `Translate the following text from ${langName(data.source)} to ${langName(data.target)}.
    Tone Requirement: ${data.tone}.
    ${data.wantTransliteration ? "Include a romanized transliteration if target is Urdu." : ""}
    CRITICAL: Maintain the identical structure of exact marker variables like __VAR_0__ perfectly.`;

    if (data.glossary?.trim())
      user += `\n\nCRITICAL GLOSSARY LOCKS (DO NOT DEVIATE):\n${data.glossary}`;
    user += `\n\nText:\n${safeText}`;

    // Determine cost tier: If simple/neutral, use low-cost. If academic/formal, route to premium logic.
    const tier = data.tone === "academic" || data.tone === "formal" ? "premium" : "low-cost";

    const result = await AIProviderManager.route({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_translation",
            description: "Return the translation result.",
            parameters: {
              type: "object",
              properties: {
                detected_language: { type: "string", description: "BCP47-ish lang code of source" },
                translation: { type: "string" },
                transliteration: { type: "string", description: "Optional romanization" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                suggestions: {
                  type: "array",
                  items: { type: "string" },
                  description: "Up to 3 alternative phrasings",
                },
              },
              required: ["translation", "confidence"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_translation" } },
    });

    const call = result?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) {
      return {
        translation: result?.choices?.[0]?.message?.content ?? "",
        confidence: 0.7,
        detected_language: data.source,
        transliteration: "",
        suggestions: [] as string[],
      };
    }
    const parsed = JSON.parse(call.function.arguments);

    // Unmask Placeholders
    let finalTrans = String(parsed.translation ?? "");
    placeholders.forEach((token, idx) => {
      finalTrans = finalTrans.replace(`__VAR_${idx}__`, token);
    });

    return {
      translation: finalTrans,
      confidence: Number(parsed.confidence ?? 0.85),
      detected_language: String(parsed.detected_language ?? data.source),
      transliteration: String(parsed.transliteration ?? ""),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
    };
  });

export const ocrAndTranslate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        imageDataUrl: z.string().min(20).max(8_000_000),
        target: z.string().min(1).max(10),
        glossary: z.string().optional(),
        userId: z.string().optional().default("anon"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await enforceLimit(data.userId, "image");

    const result = await AIProviderManager.route({
      messages: [
        {
          role: "system",
          content:
            "You extract any visible text from an image (OCR), then translate it. Return JSON via the tool.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract all text from this image, detect its language, and translate it to ${langName(
                data.target,
              )}. Preserve placeholders & variables perfectly. ${data.glossary ? `\n\nGLOSSARY LOCKS:\n${data.glossary}` : ""}`,
            },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_ocr",
            description: "Return OCR + translation",
            parameters: {
              type: "object",
              properties: {
                detected_language: { type: "string" },
                extracted_text: { type: "string" },
                translation: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                document_type: { type: "string", description: "e.g. passport, letter, screenshot" },
              },
              required: ["extracted_text", "translation", "confidence"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_ocr" } },
    });

    const call = result?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No OCR result");
    const parsed = JSON.parse(call.function.arguments);
    return {
      extracted_text: String(parsed.extracted_text ?? ""),
      translation: String(parsed.translation ?? ""),
      detected_language: String(parsed.detected_language ?? "unknown"),
      confidence: Number(parsed.confidence ?? 0.8),
      document_type: String(parsed.document_type ?? "document"),
    };
  });

export const roleplayChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant", "system"]),
              content: z.string().min(1).max(20000),
            }),
          )
          .min(1)
          .max(40),
        scenario: z.string().max(100),
        targetLanguage: z.string().max(10),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = {
      role: "system" as const,
      content: `You are an immersive Roleplay language coach. 
      The scenario is: ${data.scenario}.
      The language you must exclusively speak in is: ${langName(data.targetLanguage)}.
      Rules:
      1. Stay entirely in character based on the scenario.
      2. Respond ONLY in ${langName(data.targetLanguage)}. Do not translate your own messages.
      3. Evaluate the user's previous message complexity to guess their CEFR level (A1, A2, B1, B2, C1, C2).
      4. Provide a pronunciation and grammar score out of 100.
      5. Provide an exact and idiomatic English translation of your native reply.
      6. Provide 2-3 native phrases the user could realistically use to reply next.
      7. If the user's previous message had grammar mistakes, provide a strict, brief correction. Otherwise, return null for correction.
      You MUST return exactly valid JSON containing these fields: { "reply": "...", "translation": "...", "cefr": "...", "score": 85, "suggestions": ["..."], "correction": "..." | null }`,
    };
    const result = await AIProviderManager.route(
      {
        messages: [sys, ...data.messages],
      },
      "low-cost",
    );

    try {
      const parsed = JSON.parse(
        result?.choices?.[0]?.message?.content?.replace(/```json/g, "").replace(/```/g, "") ?? "{}",
      );
      return {
        reply: parsed.reply || String(result?.choices?.[0]?.message?.content ?? ""),
        translation: parsed.translation || "",
        cefr: parsed.cefr || "N/A",
        score: parsed.score || 0,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        correction: parsed.correction || null,
      };
    } catch (e) {
      return { reply: String(result?.choices?.[0]?.message?.content ?? ""), translation: "", cefr: "N/A", score: 0, suggestions: [], correction: null };
    }
  });

export const getVisaRequirements = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        originCountry: z.string().min(2),
        destinationCountry: z.string().min(2),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = {
      role: "system" as const,
      content: `You are an expert immigration wizard. Provide highly accurate, up-to-date student visa requirements for a citizen of the specific origin passport moving to the specific destination country for university. Format the output ENTIRELY in beautiful Markdown without codeblocks. Use Markdown headings (##), bullet points, and bold text. Include expected timelines, exact financial amounts (like blocked accounts), and specific documents. Emphasize strict regional requirements (e.g. APS certificate). Output ONLY the Markdown guide.`,
    };
    const user = {
      role: "user" as const,
      content: `Origin Passport: ${data.originCountry}\nDestination Country: ${data.destinationCountry}`,
    };
    const result = await AIProviderManager.route(
      {
        messages: [sys, user],
      },
      "premium",
    );

    return {
      markdown: String(result?.choices?.[0]?.message?.content ?? "Error fetching data.").replace(/```markdown/g, "").replace(/```/g, ""),
    };
  });

export const queryGuideRAG = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ query: z.string().min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    // PREMIUM PHASE 5 RAG SCAFFOLD
    // 1. Generate text-embedding using OpenAI or Gemini models
    // 2. Query Supabase:
    // const { data: chunks } = await supabase.rpc('match_documents', {
    //   query_embedding: embedding, match_threshold: 0.78, match_count: 5
    // });
    // 3. Inject results as Context into the LLM chain.
    
    return {
      answer: "Semantic search scaffold enabled. Please inject your Supabase `pgvector` schema credentials to activate real-time RAG answers from the document embeddings.",
      sources: ["Make-it-in-Germany Base", "CampusFrance Scaffold"],
    };
  });

export const magicDocumentAutofill = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ targetForm: z.string().min(1), userVaultData: z.string().min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    // PREMIUM PHASE 7 AUTOPILOT SCAFFOLD
    // In production, we pipe both documents into Gemini/GPT-4o alongside a JSON schema perfectly mapping layout bounds
    return {
      success: true,
      mappedFields: {
        "Applicant Name (First)": "Scaffold: Extracted from native Vault",
        "Nationality": "Scaffold: Automatically Detected",
        "Date of Birth": "Scaffold: Parsed perfectly",
        "Permanent Address": "Scaffold: Transliterated to Latin script"
      },
      message: "Autonomous Bureaucracy Copilot scaffold engaged. Form filled successfully based on vault artifacts."
    };
  });
