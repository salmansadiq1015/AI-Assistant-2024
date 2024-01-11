import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get("threadId");

  if (!threadId) {
    return Response.json({ error: "Thread Id is required!", status: "400" });
  }
  const openai = new OpenAI();
  try {
    const thread = await openai.beta.threads.del(threadId);
    console.log(thread);
    return Response.json({ thread: thread, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: `Error in delete thread route = ${error}`,
      },
      { status: 500 }
    );
  }
}
