"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useApp } from "@/components/state";
import { Button, Field, Orb, Pill } from "@/components/ui";
import { greeting } from "@/lib/format";

export function AuthScreen() {
  const { login, register, reset } = useApp();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (mode === "login") {
      if (!form.email.trim() || !form.password) {
        setError("Unesi email i lozinku.");
        return;
      }
      setError(login(form.email, form.password) ?? "");
      return;
    }
    if (!form.name.trim() || !form.username.trim() || !form.email.includes("@") || form.password.length < 4) {
      setError("Ime, korisničko ime, ispravan email i lozinka od bar 4 znaka.");
      return;
    }
    setError(register(form) ?? "");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <Orb size={28} />
          <span className="text-[18px] tracking-tight">auto ranč</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[12px] text-mute shadow-sm">Demo</span>
        </div>
        <p className="text-[13px] text-mute">Auto Ranč / Nalog</p>
        <h1 className="mt-2 text-[40px] leading-none tracking-tight">{greeting()}.</h1>
        <p className="mt-3 text-[15px] text-mute">Garaža za entuzijaste. Uloga posle ulaska je OWNER.</p>

        <div className="mt-8 rounded-card bg-white p-5 shadow-card">
          <div className="grid grid-cols-2 rounded-full bg-[#EEF3F0] p-1">
            {[
              ["login", "Prijava"],
              ["register", "Registracija"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setMode(id);
                  setError("");
                }}
                className={`h-10 rounded-full text-[14px] ${mode === id ? "bg-ink text-white" : "text-mute"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-3" onSubmit={submit}>
            {mode === "register" ? (
              <>
                <Field label="Ime" value={form.name} onChange={(event) => set("name", event.target.value)} />
                <Field
                  label="Korisničko ime"
                  value={form.username}
                  onChange={(event) => set("username", event.target.value)}
                />
              </>
            ) : null}
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
            />
            <Field
              label="Lozinka"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={(event) => set("password", event.target.value)}
              error={error}
            />
            <Button type="submit" size="lg" className="mt-2 w-full">
              <Check size={16} /> {mode === "login" ? "Prijavi se" : "Otvori nalog"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-[13px] text-mute hover:text-ink"
              onClick={() => {
                setMode("login");
                setForm((current) => ({ ...current, email: "milos@autoranc.rs", password: "demo" }));
                setError(login("milos@autoranc.rs", "demo") ?? "");
              }}
            >
              Uđi kao Miloš
            </button>
            <button type="button" className="text-[13px] text-mute hover:text-ink" onClick={() => reset(false)}>
              Resetuj demo
            </button>
          </div>
          <p className="mt-4 text-[13px] text-mute">
            Demo nalog <span className="font-mono text-ink">milos@autoranc.rs</span> · lozinka{" "}
            <span className="font-mono text-ink">demo</span>
          </p>
          <div className="mt-3">
            <Pill tone="mint">OWNER · Vlasnik</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}
