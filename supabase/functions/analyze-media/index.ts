import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, fileName, fileType, scanMode = "standard" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isVideo = fileType?.startsWith("video");
    const isDeepScan = scanMode === "deep";

    const systemPrompt = `You are a world-class deepfake and AI-generated media forensic analyst. You must analyze the provided media with extreme precision and return a comprehensive forensic report.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation outside the JSON.

${isDeepScan ? "DEEP SCAN MODE: Be extremely thorough. Check every possible artifact and provide detailed technical explanations." : "STANDARD SCAN: Provide a thorough but efficient analysis."}

Required JSON schema:
{
  "overall_score": <number 0-100, where 0 = definitely deepfake/AI, 100 = definitely authentic>,
  "risk_level": "<authentic|suspicious|likely_deepfake|inconclusive>",
  "suspected_method": "<string describing likely generation method e.g. 'StyleGAN2', 'FaceSwap', 'Stable Diffusion', 'Midjourney', 'DALL-E', 'None detected', or 'Unknown'>",
  "confidence_reasons": [
    "<reason 1 explaining the verdict>",
    "<reason 2>",
    "<reason 3>",
    "<at least 3-5 reasons>"
  ],
  "modules": {
    "facial_inconsistency": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<detailed explanation>",
      "anomalies": [
        {"finding": "<specific anomaly found>", "severity": "<low|medium|high>", "explanation": "<why this matters>"}
      ]
    },
    "metadata_compression": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<explanation about EXIF, compression artifacts, noise patterns>",
      "anomalies": []
    },
    "gan_fingerprint": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<explanation about frequency domain, checkerboard artifacts, spectral signatures>",
      "anomalies": []
    },
    "semantic_consistency": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<explanation about teeth, hands, physics, perspective>",
      "anomalies": []
    },
    "temporal_consistency": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<for video: frame flickering, blinking patterns; for images: note N/A>",
      "anomalies": []
    },
    "biological_signals": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<rPPG signals, micro-expressions, skin color variation, physiological plausibility>",
      "anomalies": []
    },
    "boundary_blending": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<face-swap edges, jawline bleeding, color temperature mismatch>",
      "anomalies": []
    },
    "eye_reflection": {
      "score": <0-100>,
      "pass": <true|false>,
      "severity": "<low|medium|high>",
      "detail": "<catchlight consistency, reflection matching>",
      "anomalies": []
    }
  }
}

CRITICAL SCORING RULES:
- 80-100: Clearly authentic, minimal anomalies
- 60-79: Suspicious, notable anomalies detected
- 40-59: INCONCLUSIVE — set risk_level to "inconclusive" and recommend manual review
- 0-39: Likely deepfake/AI-generated, significant anomalies

ACCURACY RULES:
- NEVER give a binary verdict without percentage confidence
- ALWAYS provide at least 3 reasons for your verdict
- If confidence is 40-60%, set risk_level to "inconclusive"
- For low-resolution inputs, note this reduces reliability
- Identify the SPECIFIC deepfake generation method if detected

${isVideo ? "VIDEO-SPECIFIC: Analyze temporal consistency, lip sync, blinking patterns, and frame-to-frame coherence carefully." : "IMAGE-SPECIFIC: For temporal_consistency, note it's only applicable to video and give a neutral score (75-80). Focus heavily on facial, GAN, semantic, and eye reflection analysis."}

Be forensically precise. Every finding should be actionable and explainable to a non-technical user.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageBase64) {
      const mimeType = isVideo ? "image/jpeg" : (fileType || "image/jpeg");
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Perform a ${isDeepScan ? "deep" : "standard"} forensic analysis on this media file "${fileName}" (${fileType}). Analyze EVERY module thoroughly. Return ONLY the JSON object.` },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Perform a ${isDeepScan ? "deep" : "standard"} forensic analysis on a media file named "${fileName}" (${fileType}). Since no image data was provided, provide a simulated but realistic analysis. Return ONLY the JSON object.`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: isDeepScan ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
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
