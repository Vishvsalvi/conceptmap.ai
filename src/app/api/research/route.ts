import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const systemPrompt = `
For the provided main_topic:

1. Identify the Primary Wikipedia Article: Locate the main, most relevant Wikipedia page for the main_topic.

2. Content Formatting Instructions:
   - Format all content in proper markdown syntax
   - Use # for main headings (e.g., # Introduction)
   - Use ## for subheadings (e.g., ## Historical Background)
   - Use ### for sub-sections
   - Format important terms in **bold**
   - Use *italics* for emphasis or definitions
   - Create proper bullet points using - or * for lists
   - Use numbered lists (1., 2., etc.) for sequential information
   - Include > for notable quotes or important statements
   - Maintain proper paragraph spacing using blank lines
   - Format links using [text](URL) syntax
   - Use --- for section separators where appropriate
   - Include code blocks with \`\`\` for technical content
   - Use tables where data is tabular (using | for columns)

3. Content Structure and Retrieval:
   - Start with a well-formatted introduction section
   - Include a table of contents using markdown links
   - Organize content into clear sections with proper heading hierarchy
   - Maintain proper markdown list indentation
   - Format definitions using appropriate markdown syntax
   - Include relevant cross-references as markdown links

4. Content Selection Guidelines:
   - Extract the full content but format it in markdown
   - Include 6-10 major sections beyond the introduction
   - Focus on substantial, detailed sections
   - Include relevant related articles' content
   - Total items should be between 7-11

5. Metadata Requirements:
   For each section, include:
   - title: The precise section title
   - link: Full Wikipedia URL with section anchors
   - content: The markdown-formatted content

Strict Constraints:
1. Source only from Wikipedia (en.wikipedia.org)
2. Preserve all information while enhancing readability with markdown
3. Ensure all markdown syntax is valid and properly nested
4. Maintain accurate linking and cross-references
5. Keep the JSON structure intact while formatting content in markdown

Example markdown formatting:
\`\`\`markdown
# Main Topic Title

## Introduction
**Key concept** refers to *important definition*. This topic is significant because:
- First reason
- Second reason
  - Sub-point A
  - Sub-point B

### Important Aspects
1. First aspect
2. Second aspect

> Notable quote or important statement

For more information, see [related topic](URL)
\`\`\`
`

export async function POST(req: Request) {
  const { topic }: { topic: string } = await req.json();

  try {
    const { object: data } = await generateObject({
      model: google("gemini-2.0-flash"),
      output: "array",
      schema: z.object({
        title: z.string(),
        link: z.string(),
        content: z.string()
      }),
      prompt: topic,
      system: systemPrompt
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Google API call:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
