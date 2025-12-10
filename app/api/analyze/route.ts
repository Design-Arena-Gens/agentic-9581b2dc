import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
})

export async function POST(request: NextRequest) {
  try {
    const { company } = await request.json()

    if (!company) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const prompt = `You are a business strategy consultant. Generate a comprehensive business analysis for ${company}. Provide detailed, realistic, and actionable insights.

Return a JSON object with the following structure (no markdown, just pure JSON):

{
  "swot": {
    "strengths": [4-5 specific strengths],
    "weaknesses": [4-5 specific weaknesses],
    "opportunities": [4-5 specific opportunities],
    "threats": [4-5 specific threats]
  },
  "pestle": {
    "political": [3-4 factors],
    "economic": [3-4 factors],
    "social": [3-4 factors],
    "technological": [3-4 factors],
    "legal": [3-4 factors],
    "environmental": [3-4 factors]
  },
  "competitors": [
    {
      "name": "Competitor Name",
      "analysis": "Brief competitive analysis"
    }
  ] (3-4 competitors),
  "pricing": {
    "strategy": "Overall pricing strategy description",
    "recommendations": [4-5 specific pricing recommendations]
  },
  "marketing": {
    "channels": [5-6 marketing channels],
    "tactics": [5-6 specific marketing tactics]
  },
  "growth": {
    "summary": "Overall growth plan summary (2-3 sentences)",
    "keyActions": [5-6 key action items for growth]
  }
}

Ensure all content is specific to ${company} and based on current market realities.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business strategy expert. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
