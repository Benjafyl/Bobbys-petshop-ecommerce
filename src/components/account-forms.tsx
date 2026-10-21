"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const input = "mt-1 w-full rounded-md border border-[#D8CEC1] bg-white px-4 py-3 outline-none focus:border-[#B6633A]";

export function AccountForms({ signUpEnabled }: { signUpEnabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    try {
      const result = mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(form.get("name") || "").trim() });
      if (result.error) setMessage(mode === "login" ? "No pudimos iniciar sesión. Revisa los datos." : "No pudimos crear la cuenta. Revisa los datos.");
      else if (mode === "register") { setMessage("Cuenta creada. Ahora puedes iniciar sesión."); setMode("login"); }
      else router.refresh();
    } catch { setMessage("Hubo un problema de conexión. Inténtalo de nuevo."); }
    setBusy(false);
  }
  return <div className="mt-8 max-w-lg rounded-xl border border-[#E5DED4] bg-white p-6 sm:p-8">
    <div className="flex gap-2 border-b pb-5"><button type="button" onClick={() => { setMode("login"); setMessage(""); }} className={`rounded-md px-4 py-2 font-bold ${mode === "login" ? "bg-[#243C3A] text-white" : "text-[#52615D]"}`}>Iniciar sesión</button>{signUpEnabled && <button type="button" onClick={() => { setMode("register"); setMessage(""); }} className={`rounded-md px-4 py-2 font-bold ${mode === "register" ? "bg-[#243C3A] text-white" : "text-[#52615D]"}`}>Crear cuenta</button>}</div>
    <form onSubmit={submit} className="mt-6 space-y-4">{mode === "register" && <label className="block text-sm font-bold">Nombre<input name="name" autoComplete="name" className={input} required maxLength={100} /></label>}<label className="block text-sm font-bold">Correo electrónico<input name="email" type="email" autoComplete="email" className={input} required /></label><label className="block text-sm font-bold">Contraseña<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={input} minLength={mode === "register" ? 12 : undefined} required /></label>{mode === "register" && <p className="text-xs text-[#52615D]">Usa una contraseña de al menos 12 caracteres.</p>}<button disabled={busy} className="w-full rounded-md bg-[#B6633A] px-5 py-3 font-black text-white disabled:opacity-50">{busy ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}</button><p className="text-sm text-[#B6633A]" role="status">{message}</p></form>
  </div>;
}

export function AccountSignOut() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const result = await authClient.changePassword({ currentPassword: String(form.get("currentPassword") || ""), newPassword: String(form.get("newPassword") || ""), revokeOtherSessions: true });
    setMessage(result.error ? "No pudimos cambiar la contraseña. Revisa la contraseña actual." : "Contraseña actualizada.");
    setBusy(false);
  }
  return <div><form onSubmit={changePassword} className="space-y-3"><h2 className="font-black">Seguridad de la cuenta</h2><label className="block text-xs font-bold">Contraseña actual<input name="currentPassword" type="password" autoComplete="current-password" className={input} required /></label><label className="block text-xs font-bold">Nueva contraseña<input name="newPassword" type="password" autoComplete="new-password" minLength={12} className={input} required /></label><button disabled={busy} className="w-full rounded-md bg-[#243C3A] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Cambiar contraseña</button><p role="status" className="text-xs text-[#B6633A]">{message}</p></form><button type="button" onClick={async () => { await authClient.signOut(); router.refresh(); }} className="mt-5 w-full rounded-md border border-[#D8CEC1] px-4 py-3 font-bold">Cerrar sesión</button></div>;
}
