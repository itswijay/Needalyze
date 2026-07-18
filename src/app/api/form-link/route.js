import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return Response.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { expiry_hours = 24 * 14 } = await request.json();

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiry_hours);

    const { data, error } = await supabase
      .from("form_link")
      .insert({
        user_id: user.id,
        expiry_date: expiryDate.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({
      success: true,
      linkId: data.link_id,
      formUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/form/${data.link_id}/step1`,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
