import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("newsletter_subscriptions")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing subscription:", checkError);
      return NextResponse.json(
        { success: false, error: "Database error occurred" },
        { status: 500 }
      );
    }

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: true,
          message: "You’re already subscribed to the newsletter.",
          data: {
            id: existingSubscription.id,
            email,
          },
        },
        { status: 200 }
      );
    }

    // Insert new subscription
    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          source: "website_form",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting subscription:", error);
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: {
        id: data.id,
        email: data.email,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
