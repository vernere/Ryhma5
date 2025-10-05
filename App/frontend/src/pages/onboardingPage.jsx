import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth, useUserRow } from "../hooks/useAuth";

export default function OnboardingPage() {
  const { user } = useAuth();
  const { userRow, loadingUserRow } = useUserRow();

  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    if (userRow?.username) setUsername(userRow.username);
  }, [userRow?.username]);
 
  useEffect(() => {
    if (!loadingUserRow && userRow?.is_onboarded) {
      navigate("/notes", { replace: true });
    }
  }, [loadingUserRow, userRow?.is_onboarded, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setErr("");
    const name = username.trim();
    if (!name) { setErr("Username is required"); return; }

    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ username: name, is_onboarded: true })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        setErr("Username is already taken.");
      } else {
        setErr(error.message || "Something went wrong.");
      }
      return;
    }

    navigate("/notes", { replace: true });
  }

  return (
    <div style={{ maxWidth: 460, margin: "56px auto", padding: 16 }}>
      <h2>Welcome</h2>
      <p>Pick a username to finish onboarding.</p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 10 }}>
          Username
          <input
            data-cy="onboarding-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            autoFocus
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </label>

        {err && (
          <div style={{ color: "crimson", marginBottom: 10 }} data-cy="onboarding-error">
            {err}
          </div>
        )}

        <button
          data-cy="onboarding-submit"
          disabled={saving || !username.trim()}
          type="submit"
          style={{ padding: "10px 16px", borderRadius: 10 }}
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
