import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        summary: 'AI summaries require ANTHROPIC_API_KEY to be configured.',
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system:
          'You are a healthcare practice consultant. Write a concise 2-sentence match summary for an OPD placement. ' +
          'Be specific about the strengths and any caveats. Use plain language, no markdown.',
        messages: [{ role: 'user', content: context }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text ?? 'Unable to generate summary.';
    return NextResponse.json({ summary });
  } catch (err) {
    console.error('Match AI error:', err);
    return NextResponse.json({ summary: 'Unable to generate AI summary at this time.' });
  }
}
