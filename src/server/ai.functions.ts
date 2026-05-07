import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const langName = (code: string) => {
  const map: Record<string, string> = {
    auto: "auto-detect",
    en: "English",
    it: "Italian",
    ur: "Urdu",
  };
  return map[code] ?? code;
};

async function callAI(body: unknown) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    const t = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
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
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = `You are an expert translator for English, Italian, and Urdu. Always return JSON via the provided tool.`;
    const user = `Translate the following text from ${langName(data.source)} to ${langName(
      data.target,
    )}. Tone: ${data.tone}. ${
      data.wantTransliteration ? "Include a romanized transliteration if target is Urdu." : ""
    }\n\nText:\n${data.text}`;

    const result = await callAI({
      model: "google/gemini-3-flash-preview",
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
                suggestions: { type: "array", items: { type: "string" }, description: "Up to 3 alternative phrasings" },
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
    return {
      translation: String(parsed.translation ?? ""),
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
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const result = await callAI({
      model: "google/gemini-2.5-flash",
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
              )}. Preserve line breaks where useful.`,
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

export const assistantChat = createServerFn({ method: "POST" })
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
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = {
      role: "system" as const,
      content:
        "You are LinguaBridge AI Assistant. Help users understand translations, immigration documents, university letters, and respond in formal Italian when asked. Use markdown. Be concise and warm.",
    };
    const result = await callAI({
      model: "google/gemini-3-flash-preview",
      messages: [sys, ...data.messages],
    });
    return { reply: String(result?.choices?.[0]?.message?.content ?? "") };
  });
