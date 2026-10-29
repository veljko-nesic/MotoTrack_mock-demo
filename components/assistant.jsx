"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Orb } from "@/components/ui";
import { formatDate, formatKm, formatVin } from "@/lib/format";

function answerFor(question, car, oil, shop) {
  const query = question.toLowerCase();
  if (query.includes("ulj") || query.includes("kasni") || query.includes("servisni")) {
    if (oil.overdue) {
      return `Ulje na ${car.brand} ${car.model} kasni ${formatKm(oil.excess)}. Poslednja zamena je bila na ${formatKm(oil.lastKm)}, a rok je bio ${formatKm(oil.dueKm)}.`;
    }
    return `Ulje je u roku. Sledeća zamena je za ${formatKm(oil.remaining)}, na ${formatKm(oil.dueKm)}.`;
  }
  if (query.includes("regist")) {
    return `Registracija za ${car.plate} važi do ${formatDate(car.registrationDate)}. Osiguranje važi do ${formatDate(car.insuranceDate)}.`;
  }
  if (query.includes("vin")) {
    return `VIN za ${car.model} je ${formatVin(car.vin)}.`;
  }
  if (query.includes("prepor") || query.includes("servis") || query.includes("del")) {
    return `${shop.name} je prvi predlog za ${car.brand}: ${shop.text} Adresa je ${shop.address}, telefon ${shop.phoneLabel}.`;
  }
  return `Za ${car.brand} ${car.model} mogu da proverim ulje, registraciju, VIN ili preporučeni servis.`;
}

const suggestions = ["Da li kasni ulje?", "Kada je registracija?", "Preporuči servis", "Koji je VIN?"];

export function Assistant({ car, oil, shop }) {
  const [messages, setMessages] = useState(() => [
    {
      from: "assistant",
      text: oil.overdue
        ? `Našao sam kašnjenje ulja za ${car.model}. Prekoračenje je ${formatKm(oil.excess)}.`
        : `${car.model} je u roku za ulje. Sledeća zamena je za ${formatKm(oil.remaining)}.`,
    },
  ]);
  const [draft, setDraft] = useState("");

  function ask(text) {
    const question = text.trim();
    if (!question) return;
    setMessages((current) => [
      ...current,
      { from: "user", text: question },
      { from: "assistant", text: answerFor(question, car, oil, shop) },
    ]);
    setDraft("");
  }

  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <div className="space-y-4">
        {messages.map((message, index) =>
          message.from === "assistant" ? (
            <div key={index} className="flex items-start gap-3">
              <Orb size={28} />
              <p className="max-w-xl pt-1 text-[15px] leading-6">{message.text}</p>
            </div>
          ) : (
            <div key={index} className="flex justify-end">
              <p className="max-w-md rounded-[18px] bg-[#F4F7F5] px-4 py-3 text-[15px] leading-6">{message.text}</p>
            </div>
          ),
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => ask(item)}
            className="rounded-full bg-white px-3 py-2 text-[13px] text-ink shadow-card hover:bg-[#F7FAF8]"
          >
            {item}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex items-center gap-2 rounded-full bg-white py-1 pl-4 pr-1 shadow-card ring-1 ring-[#E7EEEA]"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <Orb size={22} />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Pitaj asistenta ili reci Hej Asistent"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#A7B2AD]"
        />
        <button
          type="submit"
          aria-label="Pošalji"
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
}
