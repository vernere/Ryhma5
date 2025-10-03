 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth, useUserRow } from "../hooks/useAuth";

export default function OnboardingPage() {
  const { user } = useAuth();
  const { userRow } = useUserRow();
  const [username, setUsername] = useState(userRow?.username ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const name = username.trim();
    if (!name) { setErr("Username is required"); return; }

    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ username: name, is_onboarded: true })
      .eq("id", user.id);
    setSaving(false);

    if (error) { setErr(error.message); return; }
    navigate("/", { replace: true });
  }

  return (
    <div style={{ maxWidth: 460, margin: "56px auto", padding: 16 }}>
      <h2>Welcome</h2>
      <p>Pick a username to finish onboarding.</p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 10 }}>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}

        <button disabled={saving} type="submit" style={{ padding: "10px 16px", borderRadius: 10 }}>
          {saving ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
