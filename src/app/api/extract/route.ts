import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const systemPrompt = `I will provide a paragraph about a specific topic or subject. Your task is to extract the most relevant conceptual keywords from the paragraph. Focus on identifying terms that are central to the subject matter, themes, and concepts discussed. Additionally, suggest a few new or related keywords that align with the topic but are not explicitly mentioned in the paragraph.`;


export async function POST(req: Request){
   try {
     const { paragraph } = await req.json();
     const xai = createOpenAI({
         name: "xai",
         baseURL: "https://api.x.ai/v1",
         apiKey:
        process.env.XAI_API_KEY,
     })
     const {object: data} = await generateObject({
         model: xai("grok-beta"),
         output: "array",
         schema: z.object({
             concept: z.string(),
         }),
         prompt: paragraph,
         system: systemPrompt
     })
     return NextResponse.json({data});
   } catch (error) {
        console.error("Error in GROK API call:", error);
        return NextResponse.json({error: error}, {status: 500});
   }

}