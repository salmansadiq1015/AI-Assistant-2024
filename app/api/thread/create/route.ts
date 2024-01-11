import OpenAI from "openai";

export async function GET() {
  const openai = new OpenAI();
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread);

    return Response.json({ thread: thread }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in create thread route = ${error}` },
      { status: 500 }
    );
  }
}
