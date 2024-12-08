import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const systemPrompt = `
**Research + internet source**: Gather relevant external information from trusted sources and provide clickable links to each. Aim for 5 to 10 links, covering various types of sources:
about the topic.
Wikipedia - Links to general summaries, topics related to the subjects and overview articles.
arXiv - Links to preprints and research papers on relevant scientific topics.
PubMed - Links to peer-reviewed articles in biomedical and life sciences.
Semantic Scholar - Links to academic papers with AI-enhanced analysis.
Links - Provide general links to trusted websites or relevant articles.
News - Links to credible, recent news articles.
YouTube - Links to videos or lectures relevant to the topic.
Podcasts - Links to episodes featuring expert discussions and in-depth analyses.
Books - Links to books or e-books for deeper learning (Amazon, Google Books, or similar).
References - Links to general reference materials for broader study.
Recent Developments - Links to the latest articles or advancements.

Please only return the links that are working and relevant to the topic.
`
export async function POST(req: Request) {
  const { source, topic }: { source: string, topic: string } = await req.json();

  try {
    const xai = createOpenAI({
      name: "xai",
      baseURL: "https://api.x.ai/v1",
      apiKey:
        process.env.XAI_API_KEY,
    });

    const { object: data } = await generateObject({
      model: xai("grok-beta"),
      output: "array",
      schema: z.object({
        title: z.string(),
        link: z.string(),
        source: z.string(),
      }),
      prompt: `Research on ${topic} from ${source}`,
      system: systemPrompt

    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in GROK API call:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
