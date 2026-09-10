import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitizeString } from "@/lib/sanitizer";
import { generateQR } from "@/lib/qr";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const requiredFields = ["name", "sap", "email", "phone", "orbit", "expectations"];

    // Check required fields
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Extract and sanitize inputs
    const name = sanitizeString(data.name, 100);
    const email = sanitizeString(data.email, 254).toLowerCase();
    const phone = String(data.phone).trim();
    const sap = String(data.sap).trim();
    const orbit = String(data.orbit).trim();
    const expectations = sanitizeString(data.expectations, 500);

    // Validate name length
    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: "Name must not exceed 100 characters" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Phone number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    // Validate SAP ID (can start with 5000 or 5900)
    if (!/^(500\d{6}|5900\d{5})$/.test(sap)) {
      return NextResponse.json(
        { success: false, message: "SAP ID must be 9 digits and start with 5000 or 5900" },
        { status: 400 }
      );
    }

    // Validate orbit (year)
    if (!["1", "2", "3", "4"].includes(orbit)) {
      return NextResponse.json(
        { success: false, message: "Invalid year selection" },
        { status: 400 }
      );
    }

    // Validate expectations length
    if (expectations.length < 5) {
      return NextResponse.json(
        { success: false, message: "Expectations must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (expectations.length > 500) {
      return NextResponse.json(
        { success: false, message: "Expectations must not exceed 500 characters" },
        { status: 400 }
      );
    }

    // Duplicate checks in Supabase
    const { data: sapCheck } = await supabase
      .from("workshop_registration")
      .select("sap")
      .eq("sap", sap);

    if (sapCheck && sapCheck.length > 0) {
      return NextResponse.json(
        { success: false, message: "SAP ID already registered" },
        { status: 409 }
      );
    }

    const { data: emailCheck } = await supabase
      .from("workshop_registration")
      .select("email")
      .eq("email", email);

    if (emailCheck && emailCheck.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const { data: phoneCheck } = await supabase
      .from("workshop_registration")
      .select("phone")
      .eq("phone", phone);

    if (phoneCheck && phoneCheck.length > 0) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Insert new registration record into Supabase
    const record = {
      name,
      sap,
      email,
      phone,
      orbit,
      expectations,
      attended: false,
    };

    await supabase.from("workshop_registration").insert(record);

    // Generate QR code and send email
    try {
      const qrBuffer = await generateQR(record);
      await sendRegistrationEmail(qrBuffer, email);
    } catch (emailErr) {
      console.error("Email/QR service error:", emailErr.message || emailErr);
      console.error("Full error:", JSON.stringify(emailErr, null, 2));
    }

    return NextResponse.json(
      { success: true, message: "Registration successful" },
      { status: 200 }
    );
  } catch (e) {
    const errMsg = String(e);
    console.error("Registration error:", errMsg);

    if (errMsg.includes("PGRST205") || errMsg.includes("schema cache")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Database table 'workshop_registration' not found. Please run backend/schema.sql in your Supabase SQL editor.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred. Please check database configuration.",
      },
      { status: 500 }
    );
  }
}
