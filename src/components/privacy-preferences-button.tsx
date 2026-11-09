"use client";

export function PrivacyPreferencesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("bobbys-privacy-preferences"))} className="text-left">Preferencias de privacidad</button>;
}
