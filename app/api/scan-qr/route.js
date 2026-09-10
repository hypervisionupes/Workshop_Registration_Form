import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Invalid QR data" },
        { status: 400 }
      );
    }

    const sapId = String(data.sapId || data.sap || "").trim();

    if (!sapId) {
      return NextResponse.json(
        { success: false, message: "SAP ID is required in QR payload" },
        { status: 400 }
      );
    }

    // Check if already scanned
    const { data: attendanceCheck } = await supabase
      .from("attendance")
      .select("sap_id")
      .eq("sap_id", sapId);

    if (attendanceCheck && attendanceCheck.length > 0) {
      return NextResponse.json(
        { success: false, message: "QR already scanned" },
        { status: 409 }
      );
    }

    // Check registration record
    const { data: userCheck } = await supabase
      .from("workshop_registration")
      .select("*")
      .eq("sap", sapId);

    if (!userCheck || userCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "Registration not found for this SAP ID" },
        { status: 400 }
      );
    }

    // Mark attendance in attendance table
    await supabase.from("attendance").insert({ sap_id: sapId });

    // Mark attended flag in workshop_registration
    await supabase
      .from("workshop_registration")
      .update({ attended: true })
      .eq("sap", sapId);

    return NextResponse.json(
      { success: true, message: "Attendance marked successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Scan QR error:", e);
    return NextResponse.json(
      { success: false, message: "Server error occurred while scanning QR" },
      { status: 500 }
    );
  }
}
