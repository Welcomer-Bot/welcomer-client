import { getFonts } from "font-list";
export const revalidate = 9999;
export async function GET() {
  const fonts = await getFonts({ disableQuoting: true });
  return new Response(JSON.stringify(fonts), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
