import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, fileName, fileType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a deepfake detection AI. Analyze the provided image for signs of AI generation or manipulation. You MUST respond with a valid JSON object using this exact schema — no markdown, no explanation outside the JSON:

{
  "overall_score": <number 0-100, 100 = fully authentic>,
  "risk_level": "<authentic|suspicious|likely_deepfake>",
  "modules": {
    "eye_reflection": { "score": <0-100>, "pass": <true|false>, "detail": "<1-2 sentence explanation>" },
    "facial_artifact": { "score": <0-100>, "pass": <true|false>, "detail": "<explanation>" },
    "audio_visual": { "score": <0-100>, "pass": <true|false>, "detail": "<explanation>" },
    "frequency_domain": { "score": <0-100>, "pass": <true|false>, "detail": "<explanation>" },
    "temporal_consistency": { "score": <0-100>, "pass": <true|false>, "detail": "<explanation>" },
    "physiological": { "score": <0-100>, "pass": <true|false>, "detail": "<explanation>" }
  }
}

Scoring guide:
- 80-100: Clearly authentic, no anomalies
- 50-79: Suspicious, some anomalies detected
- 0-49: Likely deepfake, significant anomalies

For images, audio_visual and temporal_consistency should note they're only applicable to video and give neutral scores (75-85).
Analyze carefully: check eye reflections, skin texture, edge artifacts, frequency patterns, and physiological plausibility.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageBase64) {
      const mimeType = fileType?.startsWith("video") ? "image/jpeg" : (fileType || "image/jpeg");
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Analyze this media file "${fileName}" for deepfake indicators. Return ONLY the JSON object.` },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Analyze a media file named "${fileName}" (${fileType}) for deepfake indicators. Since no image data was provided, provide a simulated analysis. Return ONLY the JSON object.`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response (handle potential markdown wrapping)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();

    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis results");
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-media error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
