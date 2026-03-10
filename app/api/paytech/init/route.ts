import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderNumber, total, customerPhone, items } = body;

    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET;

    const payload = {
      item_name: `Commande Streamy ${orderNumber}`,
      item_price: total,
      currency: "XOF",
      ref_command: orderNumber,
      command_name: `Commande Streamy ${orderNumber}`,
      env: "prod",
      ipn_url: "https://streamy.sn/api/paytech/ipn",
      success_url: "https://streamy.sn/confirmation",
      cancel_url: "https://streamy.sn/confirmation",
      custom_field: JSON.stringify({
        orderNumber,
        customerPhone,
        items,
      }),
    };

    const response = await fetch(
      "https://paytech.sn/api/payment/request-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_KEY: apiKey || "",
          API_SECRET: apiSecret || "",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur PayTech :", error);
    return NextResponse.json(
      { error: "Erreur serveur PayTech" },
      { status: 500 }
    );
  }
}
