import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const adminClient = createAdminClient();

    await adminClient.from("documents").delete().eq("user_id", userId);
    await adminClient.from("flow_instances").delete().eq("user_id", userId);
    await adminClient.from("deadlines").delete().eq("user_id", userId);
    await adminClient.from("tips").delete().eq("user_id", userId);
    await adminClient.from("subscriptions").delete().eq("user_id", userId);
    await adminClient.from("profiles").delete().eq("id", userId);

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Failed to delete auth user:", deleteUserError.message);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}