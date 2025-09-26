// Vercel Serverless Function: Proxy ke Sumopod Chat Completions API
// Env: SUMOPOD_API_KEY (set di Vercel Project Settings)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { food_hints } = req.body || {}
    if (!Array.isArray(food_hints) || food_hints.length === 0) {
      res.status(400).json({ error: 'food_hints array is required' })
      return
    }

    const apiKey = process.env.SUMOPOD_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'SUMOPOD_API_KEY not configured' })
      return
    }

    const SYSTEM_INSTRUCTION = "You are a nutrition expert. Only output strict JSON per the provided schema. No explanations, no markdown, no code fences."
    const SCHEMA_HINT = `Return STRICT JSON ONLY with this schema (no extra fields):\n{\n  "food_name": "string",\n  "serving_size_g": number,\n  "calories_kcal": number,\n  "macros": {\n    "protein_g": number,\n    "carbs_g": number,\n    "fat_g": number,\n    "fiber_g": number,\n    "sugar_g": number\n  },\n  "micros": {\n    "sodium_mg": number,\n    "potassium_mg": number,\n    "calcium_mg": number,\n    "iron_mg": number,\n    "vitamin_a_mcg": number,\n    "vitamin_c_mg": number,\n    "cholesterol_mg": number\n  },\n  "allergens": ["string"],\n  "notes": "string"\n}`

    // Panggil paralel untuk beberapa hint
    const results = await Promise.all(
      food_hints.slice(0, 5).map(async (hint) => {
        const payload = {
          model: 'gemini-2.0-flash',
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: `Given the food name or hint: '${hint}'. Infer the most likely single food item and its nutritional facts per 100g. If serving size is known in typical portion, put it in 'serving_size_g'. Otherwise set serving_size_g to 100. ` + SCHEMA_HINT }
          ],
          max_tokens: 500,
          temperature: 0.3
        }

        const resp = await fetch('https://ai.sumopod.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        })

        if (!resp.ok) {
          const t = await resp.text()
          return { food_name: hint, error: `API error ${resp.status}: ${t}` }
        }
        const data = await resp.json()
        const content = data?.choices?.[0]?.message?.content || data?.content || ''
        // Coba parse JSON; jika gagal, ekstrak {...} terluas
        let jsonObj = null
        try {
          jsonObj = JSON.parse(content)
        } catch (e) {
          const m = content?.match(/\{[\s\S]*\}/)
          if (m) {
            try { jsonObj = JSON.parse(m[0]) } catch {}
          }
        }
        if (!jsonObj) {
          jsonObj = { food_name: hint, error: 'Failed to parse model output' }
        }
        return jsonObj
      })
    )

    res.status(200).json({ results })
  } catch (e) {
    console.error('sumopod proxy error', e)
    res.status(500).json({ error: 'internal_error', detail: String(e) })
  }
}


