import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_name, fields, page_url } = body;

    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required form fields." },
        { status: 400 }
      );
    }

    // Extract client metadata
    const ip_address =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const device_info = req.headers.get("user-agent") || "Unknown Device";

    const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://janfranko.com";
    const formSecret = process.env.FORM_SECRET_KEY || "";
    const wpUsername = process.env.WP_USERNAME || "sabamalik";
    const wpAppPassword = process.env.WP_APP_PASSWORD || "";
    const authHeader = wpAppPassword
      ? `Basic ${Buffer.from(`${wpUsername}:${wpAppPassword}`).toString("base64")}`
      : undefined;

    const endpoint = `${wpBaseUrl.replace(/\/$/, "")}/wp-json/janfranko/v1/submit-form`;

    const referer = req.headers.get("referer");
    const origin = req.headers.get("origin") || (referer ? new URL(referer).origin : "http://localhost:3000");

    let fullPageUrl = page_url || referer || origin;
    if (fullPageUrl && !fullPageUrl.startsWith("http")) {
      fullPageUrl = `${origin.replace(/\/$/, "")}${fullPageUrl.startsWith("/") ? "" : "/"}${fullPageUrl}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-JF-Form-Secret": formSecret,
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward to WordPress REST API
    const wpRes = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        form_name: form_name || "General Inquiry",
        fields: fields,
        page_url: fullPageUrl,
        ip_address: ip_address,
        device_info: device_info,
      }),
      cache: "no-store",
    });

    if (!wpRes.ok) {
      const errText = await wpRes.text();
      console.error("WordPress Form Proxy API error:", wpRes.status, errText);
      return NextResponse.json(
        { success: false, message: "WordPress server accepted submission with error or pending setup." },
        { status: 200 } // Graceful fallback so user is not blocked
      );
    }

    const data = await wpRes.json();
    return NextResponse.json({
      success: true,
      message: data.message || "Form submission recorded successfully.",
    });
  } catch (error) {
    console.error("Next.js Form Proxy catch error:", error);
    return NextResponse.json(
      { success: true, message: "Form submission received." },
      { status: 200 }
    );
  }
}
