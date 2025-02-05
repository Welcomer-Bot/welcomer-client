import { getFonts } from "font-list";
import { NextApiRequest, NextApiResponse } from "next";
export const revalidate = 9999;
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const fonts = await getFonts({ disableQuoting: true });
  return new Response(JSON.stringify(fonts), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
