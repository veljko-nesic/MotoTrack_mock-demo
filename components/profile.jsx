"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useApp } from "@/components/state";
import { Button, Field, Pill } from "@/components/ui";

export function Profile() {
  const { user, updateProfile, logout } = useApp();
  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
  });
  const signature = `${user.id}|${user.name}|${user.username}|${user.email}`;
  const [seen, setSeen] = useState(signature);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (seen !== signature) {
    setSeen(signature);
    setForm({ name: user.name, username: user.username, email: user.email, password: "" });
  }

  const set = (key, value) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <p className="text-[13px] text-mute">Nalog</p>
        <h1 className="mt-2 text-[40px] leading-none tracking-tight">Profil</h1>
        <div className="mt-4">
          <Pill tone="ink">OWNER · Vlasnik</Pill>
        </div>
      </header>

      <form
        className="space-y-3 rounded-card bg-white p-5 shadow-card"
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.name.trim() || !form.username.trim() || !form.email.includes("@")) {
            setError("Ime, korisničko ime i ispravan email su obavezni.");
            return;
          }
          if (form.password && form.password.length < 4) {
            setError("Nova lozinka mora imati bar 4 znaka.");
            return;
          }
          const patch = {
            name: form.name.trim(),
            username: form.username.trim(),
            email: form.email,
          };
          if (form.password) patch.password = form.password;
          const message = updateProfile(patch);
          setError(message ?? "");
          if (!message) {
            setSaved(true);
            setForm((current) => ({ ...current, password: "" }));
          }
        }}
      >
        <Field label="Ime" value={form.name} onChange={(event) => set("name", event.target.value)} />
        <Field
          label="Korisničko ime"
          value={form.username}
          onChange={(event) => set("username", event.target.value)}
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <Field
          label="Nova lozinka"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => set("password", event.target.value)}
          hint="Ostavi prazno ako ne menjaš lozinku."
          error={error}
        />
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="ghost" onClick={logout}>
            Odjavi se
          </Button>
          <div className="flex items-center gap-3">
            {saved ? <span className="text-[13px] text-[#0E7A4B]">Sačuvano</span> : null}
            <Button type="submit">
              <Check size={16} /> Sačuvaj
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
