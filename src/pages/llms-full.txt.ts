import { llmsText } from '../lib/llms';

export async function GET() {
  return new Response(await llmsText(true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
