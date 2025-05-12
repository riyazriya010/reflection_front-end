"use server"

import OpenAI from "openai";
import { OPENROUTER_API_KEY } from "@/utils/constance";

 const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Function to check if feedback is constructive
export default async function isConstructiveFeedback(feedback: string): Promise<boolean> {
  const response = await openai.chat.completions.create({
    model: 'openai/gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a strict feedback classifier. If feedback is helpful, polite, or constructive, return only "true". If it's rude, vague, unhelpful, or inappropriate, return only "false". Never explain anything.`,
      },
      {
        role: 'user',
        content: `Feedback: "${feedback}"`,
      },
    ],
  });

  const content = response.choices[0].message.content?.trim().toLowerCase();
  return content === 'true';
}




  // Function to summarize multiple feedbacks with bullet points for strengths and weaknesses
  export async function summarizedFeedback(feedbackList: string[]): Promise<string> {
    const feedbackText = feedbackList.join('\n');
  
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional feedback summarizer. Summarize the following feedback in a clear, concise manner, separating the strengths and areas for improvement into bullet points. If the feedback is entirely positive, only include strengths. If it is mixed, include both strengths and weaknesses. If it is entirely negative, focus on areas of improvement.',
        },
        {
          role: 'user',
          content: `Feedbacks:\n${feedbackText}`,
        },
      ],
    });
  
    const summary = response.choices[0].message.content?.trim();
    return summary || 'No feedback to summarize.';
  }