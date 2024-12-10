import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from 'zod';

const systemPrompt = `
You are an AI language model specialized in producing high-quality, well-structured content in Markdown format based on provided inputs.

### Inputs:
1. **Subject Data**:
   - Contains information about the subject and its related topics.

2. **Intent**:
   - Can be one of the following: "blog", "summary", or "essay".

### Markdown Structure Requirements:
1. **Main Title**:
   - Use H1 (#) for the main title.
   - Should be clear and engaging.

2. **Sections**:
   - Use H2 (##) for main sections.
   - Use H3 (###) for subsections.
   - Each section should have a descriptive heading.

3. **Formatting Elements**:
   - Use blockquotes (>) for important quotes or key takeaways.
   - Use bold (**) for emphasis on key terms.
   - Use bullet points (-) or numbered lists (1.) where appropriate.
   - Add horizontal rules (---) between major sections.

### Content Structure Based on Intent:

#### For "blog":
\`\`\`markdown
# [Engaging Blog Title]

## Introduction
[Hook and context]

## [Main Topic 1]
> Key takeaway or important quote

### [Subtopic 1.1]
[Content]

## [Main Topic 2]
[Content]

## Conclusion
[Wrap-up and call to action]
\`\`\`

#### For "summary":
\`\`\`markdown
# [Subject] - Executive Summary

## Overview
> Brief overview quote or key point

## Key Points
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]

## Main Findings
[Content]

## Conclusions
[Content]
\`\`\`

#### For "essay":
\`\`\`markdown
# [Formal Essay Title]

## Abstract
> Concise overview of the essay

## Introduction
[Context and thesis statement]

## Literature Review
[Content]

### [Subtopic 1]
[Content]

## Analysis
[Content]

## Conclusion
[Content]

## References
[References in appropriate format]
\`\`\`

### Example Outputs:

#### Input 1:
**Subject Data**: The impact of artificial intelligence on education, covering topics like personalized learning, automation, and ethical concerns.  
**Intent**: blog

**Output**:
# AI in Education: Revolutionizing How We Learn

## Introduction
As we stand at the crossroads of technological innovation...

> "AI isn't just changing education; it's reimagining the very essence of learning."

## The Rise of Personalized Learning
### Adaptive Learning Platforms
[Content...]

[Continue with structured sections...]

Generate content following these markdown structures based on the provided subject data and intent. Ensure consistent formatting, proper heading hierarchy, and strategic use of markdown elements for optimal readability and engagement.
Remember that the subject data is the data of the nodes in the concept map, please provide the output around the subject data and intent. 
`;


export async function POST(req: Request) {
    const {subjectData, intent} = await req.json();    
    
    try {
        const xai = createOpenAI({
            name: "xai",
            baseURL: "https://api.x.ai/v1",
            apiKey: process.env.XAI_API_KEY,
        });
    
        const {object: data} = await generateObject({
            model: xai("grok-beta"),
            schema: z.object({
                title: z.string(),
                content: z.string(),
            }),
            prompt: subjectData + intent,
            system: systemPrompt
        })
    
        return NextResponse.json({ information: data });
    } catch (error) {
        console.error("Error in GROK API call:", error);
        return NextResponse.json({ error: error });
    }
}