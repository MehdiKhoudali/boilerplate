import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const body = await req.text();
    const { email } = JSON.parse(body);
  if (!email) {
    return NextResponse.json({message: 'No email provided'}, { status: 400 });
  }

  try {
    // Add your Resend audience ID here
    const audience = process.env.RESEND_AUDIENCE_ID;
    await axios.post(
      `https://api.resend.com/audiences/${audience}/contacts`,
      {
        email,
        first_name: "", // Add first name if available
        last_name: "", // Add last name if available
        unsubscribed: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      {message: "Your email has been successfully added to the mailing list. Welcome 👋"},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {message: "Oops, there was a problem with your subscription, please try again or contact us"},
      { status: 500 }
    );
  }
}
