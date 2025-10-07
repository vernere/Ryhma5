import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function OnboardingPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.username) setUsername(user.username);
  }, [user.username]);

  useEffect(() => {
    if (user.is_onboarded) {
      navigate("/notes", { replace: true });
    }
  }, [user.is_onboarded, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setErr("");

    const name = username.trim();

    if (!name) {
      setErr("Username is required");
      return;
    }

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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow flex flex-col gap-6">
      <div className="gap-2 flex flex-col">
        <h1
         className="text-2xl font-bold"
        >👋 Welcome
        </h1>
        <p>Please pick a suitable username to get started.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-4">
          <label>Username</label>
          <Input
            data-cy="onboarding-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            autoFocus
          />
          {err && (
            <span
              className="text-sm text-red-600 block mt-2"
              data-cy="onboarding-error"
            >
              {err}
            </span>
          )}
        </div>
        <Button
          data-cy="onboarding-submit"
          disabled={saving || !username.trim()}
          type="submit"
        >
          {saving ? "Saving..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
