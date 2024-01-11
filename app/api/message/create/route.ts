import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { message, threadId } = await req.json();

  if (!message || !threadId) {
    return Response.json(
      { error: "Missing message or threadId" },
      { status: 400 }
    );
  }
  const openai = new OpenAI();
  try {
    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
    console.log(threadMessage);

    return Response.json({ message: threadMessage }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error in creating message" },
      { status: 500 }
    );
  }
}
