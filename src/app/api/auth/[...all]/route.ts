// supabase handles auth through its own api
// this file is no longer needed but kept for compatibility
export async function GET() {
  return new Response("Supabase Auth is used", { status: 200 });
}

export async function POST() {
  return new Response("Supabase Auth is used", { status: 200 });
}
