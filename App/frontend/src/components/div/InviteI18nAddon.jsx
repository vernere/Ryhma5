import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function InviteI18nDemo() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [errorKey, setErrorKey] = useState(null);

  const handleInvite = () => {
    if (!username.trim()) return;
     setErrorKey("errors.userNotFound");
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      {errorKey && (
        <div
          data-cy="error-banner"
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {t(errorKey, { username })}
        </div>
      )}

      <label className="block text-sm font-medium">
        {t("invite.title", "Invite collaborator")}
      </label>

      <div className="flex gap-2">
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder={t("invite.placeholder", "Enter username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="rounded-lg border px-4 text-sm" onClick={handleInvite}>
          {t("invite.send", "Invite")}
        </button>
      </div>
    </div>
  );
}

