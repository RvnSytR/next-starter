/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function GET() {
  const email = "user@gmail.com";
  const email2 = "admin@gmail.com";

  try {
    const res = new Promise((resolve) =>
      setTimeout(() => {
        resolve("Hello From Promises Response");
      }, 1000),
    );

    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
