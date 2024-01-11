import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get("threadId");
  const assistantId = searchParams.get("assistantId");
  //   Validation
  if (!threadId)
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  if (!assistantId) {
    return Response.json(
      { error: "No  assistant id provided" },
      { status: 400 }
    );
  }

  const openai = new OpenAI();
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    console.log("Run:", run);
    return Response.json({ run: run }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in create run api! ` },
      { status: 500 }
    );
  }
}
