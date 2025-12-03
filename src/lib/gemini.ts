// Real market prices researched from actual marketplace data (2024)
import { searchMarketPrices, getRawMarketData } from './marketSearch'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
// Use Gemini 1.5 Pro for better analysis and search capabilities
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent'

export interface DeviceAnalysis {
  valueMin: number
  valueMax: number
  confidence: number
  damageAnalysis: {
    detected: boolean
    severity: 'none' | 'minor' | 'moderate' | 'severe'
    areas: string[]
    description: string
  }
  suggestedListing: string
  marketInsights: string
}

export interface DeviceSpecs {
  brand: string
  model: string
  storage?: string
  ram?: string
  accessories?: string
  photoBase64?: string
}

// Simple Gemini call without search tools
async function callGemini(prompt: string, imageBase64?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const requestBody: Record<string, unknown> = {
    contents: [{
      parts: imageBase64
        ? [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        : [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    }
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', response.status, errorText)
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()

  let textContent = ''
  const parts = data.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.text) {
      textContent += part.text
    }
  }

  if (!textContent) {
    console.error('Empty Gemini response:', JSON.stringify(data))
    throw new Error('Empty response from AI')
  }

  return textContent
}

async function callGeminiWithSearch(prompt: string, imageBase64?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const requestBody: Record<string, unknown> = {
    contents: [{
      parts: imageBase64
        ? [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        : [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    },
    // Enable Google Search for real-time market data
    tools: [{
      google_search: {}
    }]
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', response.status, errorText)
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()

  // Extract text from response (may include search results)
  let textContent = ''
  const parts = data.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.text) {
      textContent += part.text
    }
  }

  if (!textContent) {
    console.error('Empty Gemini response:', JSON.stringify(data))
    throw new Error('Empty response from AI')
  }

  return textContent
}

function extractJSON(text: string): Record<string, unknown> {
  let jsonStr = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')

  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('No JSON found in response')
    throw new Error('No JSON found in response')
  }

  jsonStr = jsonMatch[0]

  jsonStr = jsonStr
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('JSON parse error:', e)
    throw new Error('Failed to parse JSON')
  }
}

export async function analyzeDevice(specs: DeviceSpecs): Promise<DeviceAnalysis> {
  const deviceName = `${specs.brand} ${specs.model}${specs.storage ? ` ${specs.storage}` : ''}`

  // Fetch raw HTML data from marketplaces
  const marketData = await getRawMarketData(specs.brand, specs.model)

  const htmlData = marketData ? `
RAW MARKETPLACE HTML DATA FOR ANALYSIS:

${marketData.ebayHtml ? `=== EBAY HTML ===\n${marketData.ebayHtml.slice(0, 10000)}\n` : ''}
${marketData.swappaHtml ? `=== SWAPPA HTML ===\n${marketData.swappaHtml.slice(0, 10000)}\n` : ''}

ANALYZE THIS HTML DATA to find actual sold prices and current listings.
` : 'No marketplace data available - use general market knowledge.'

  const prompt = `ANALYZE THIS DEVICE and determine its current used resale value.

${specs.photoBase64 ? '📸 PHOTO PROVIDED: Examine the device carefully for condition, damage, wear, scratches, screen condition, etc.' : '❌ NO PHOTO: Use typical good used condition'}

DEVICE: "${deviceName}"

${htmlData}

Based on the photo analysis and marketplace HTML data above, determine the resale value.

Return ONLY this JSON format:
{
  "valueMin": <lowest realistic price based on data>,
  "valueMax": <highest realistic price based on data>,
  "confidence": <1-100 based on data quality>,
  "damageAnalysis": {
    "detected": <true if damage visible in photo, false otherwise>,
    "severity": "<none|minor|moderate|severe>",
    "areas": ["list", "of", "damaged", "areas", "visible", "in", "photo"],
    "description": "<detailed condition description based on photo analysis>"
  },
  "suggestedListing": "<honest listing description mentioning condition>",
  "marketInsights": "<analysis based on marketplace data provided>"
}`

  const text = await callGemini(prompt, specs.photoBase64)

  try {
    const parsed = extractJSON(text)

    const result: DeviceAnalysis = {
      valueMin: Number(parsed.valueMin) || 200,
      valueMax: Number(parsed.valueMax) || 350,
      confidence: Number(parsed.confidence) || 70,
      damageAnalysis: {
        detected: Boolean((parsed.damageAnalysis as Record<string, unknown>)?.detected),
        severity: String((parsed.damageAnalysis as Record<string, unknown>)?.severity || 'none') as 'none' | 'minor' | 'moderate' | 'severe',
        areas: Array.isArray((parsed.damageAnalysis as Record<string, unknown>)?.areas) ? (parsed.damageAnalysis as Record<string, unknown>).areas as string[] : [],
        description: String((parsed.damageAnalysis as Record<string, unknown>)?.description || 'Good used condition')
      },
      suggestedListing: String(parsed.suggestedListing || `${specs.brand} ${specs.model} in good condition`),
      marketInsights: String(parsed.marketInsights || 'Based on market comparables')
    }

    // Basic validation only
    if (result.valueMin > result.valueMax || result.valueMin < 0) {
      throw new Error('Invalid price range')
    }

    return result
  } catch (e) {
    console.error('Parse error:', e)
    throw new Error('Could not analyze device condition and determine value')
  }
}

export async function getMarketComparison(brand: string, model: string): Promise<{
  recentSales: Array<{
    price: number
    condition: string
    date: string
    platform: string
  }>
  averagePrice: number
  priceRange: { min: number; max: number }
  demandLevel: 'low' | 'medium' | 'high'
}> {
  // Fetch raw HTML data from marketplaces
  const marketData = await getRawMarketData(brand, model)

  const htmlData = marketData ? `
RAW MARKETPLACE HTML DATA FOR ANALYSIS:

${marketData.ebayHtml ? `=== EBAY HTML ===\n${marketData.ebayHtml.slice(0, 8000)}\n` : ''}
${marketData.swappaHtml ? `=== SWAPPA HTML ===\n${marketData.swappaHtml.slice(0, 8000)}\n` : ''}

ANALYZE THIS HTML DATA to find actual sold prices and current listings.
` : 'No marketplace data available - use general market knowledge.'

  const prompt = `Analyze the marketplace HTML data for "${brand} ${model}" and extract pricing information.

${htmlData}

Return ONLY this JSON with data extracted from the HTML:
{
  "recentSales": [
    {"price": <real price found in HTML>, "condition": "<condition from HTML>", "date": "<date from HTML>", "platform": "<source>"},
    {"price": <real price found in HTML>, "condition": "<condition from HTML>", "date": "<date from HTML>", "platform": "<source>"},
    {"price": <real price found in HTML>, "condition": "<condition from HTML>", "date": "<date from HTML>", "platform": "<source>"},
    {"price": <real price found in HTML>, "condition": "<condition from HTML>", "date": "<date from HTML>", "platform": "<source>"},
    {"price": <real price found in HTML>, "condition": "<condition from HTML>", "date": "<date from HTML>", "platform": "<source>"}
  ],
  "averagePrice": <average of prices found in HTML>,
  "priceRange": {"min": <lowest price in HTML>, "max": <highest price in HTML>},
  "demandLevel": "<low|medium|high based on data volume in HTML>"
}`

  const text = await callGemini(prompt)

  try {
    const parsed = extractJSON(text)

    const recentSales = Array.isArray(parsed.recentSales)
      ? (parsed.recentSales as Array<Record<string, unknown>>).map(sale => ({
          price: Number(sale.price) || 0,
          condition: String(sale.condition || 'Good'),
          date: String(sale.date || 'Recently'),
          platform: String(sale.platform || 'Marketplace')
        })).filter(sale => sale.price > 0)
      : []

    if (recentSales.length === 0) {
      throw new Error('No market data found')
    }

    const prices = recentSales.map(s => s.price)
    const avgPrice = Number(parsed.averagePrice) || Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const min = Number((parsed.priceRange as Record<string, unknown>)?.min) || Math.min(...prices)
    const max = Number((parsed.priceRange as Record<string, unknown>)?.max) || Math.max(...prices)

    return {
      recentSales,
      averagePrice: avgPrice,
      priceRange: { min, max },
      demandLevel: (parsed.demandLevel as 'low' | 'medium' | 'high') || 'medium'
    }
  } catch (e) {
    console.error('Market data parse error:', e)
    throw new Error('Could not fetch market data. Please try again.')
  }
}