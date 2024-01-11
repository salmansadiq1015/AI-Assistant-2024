import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get("threadId");
  const runId = searchParams.get("runId");

  if (!threadId)
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  if (!runId)
    return Response.json({ error: "No run id provided" }, { status: 400 });

  const openai = new OpenAI();
  try {
    const run = await openai.beta.threads.runs.cancel(threadId, runId);
    console.log("Cancel Run", run);

    return Response.json({ run: run }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error in cancel run api!" },
      { status: 500 }
    );
  }
}
