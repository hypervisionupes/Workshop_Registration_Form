import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitizeString } from "@/lib/sanitizer";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const name = sanitizeString(data.name, 100);
    const sap = String(data.sap || data.hypervisionId || "").trim();
    const ratings = data.ratings || [];
    const feedbackText = sanitizeString(data.feedback, 1500);

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      return NextResponse.json(
        { success: false, message: "Ratings are required" },
        { status: 400 }
      );
    }

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + parseFloat(r), 0);
    const avgRating =
      ratings.length > 0
        ? Math.round((totalRating / ratings.length) * 100) / 100
        : 0;

    const document = {
      name,
      sap,
      ratings,
      avg_rating: avgRating,
      feedback: feedbackText,
    };

    await supabase.from("workshop_feedback").insert(document);

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Feedback submission error:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred while saving feedback",
      },
      { status: 500 }
    );
  }
}
