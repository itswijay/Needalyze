import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { user_id, expiry_hours = 24*14 } = await request.json();

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiry_hours);

    const { data, error } = await supabase
      .from("form_link")
      .insert({
        user_id: user_id,
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
      { status: 500 }
    );
  }
}
