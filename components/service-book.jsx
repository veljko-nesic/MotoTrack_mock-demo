"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useApp } from "@/components/state";
import { Button, Field, Modal, Pill, SectionTitle } from "@/components/ui";
import { formatDate, formatKm, formatRsd, todayIso, uid } from "@/lib/format";

const priorities = [
  { id: "high", label: "Visok", tone: "red" },
  { id: "medium", label: "Srednji", tone: "peach" },
  { id: "low", label: "Nizak", tone: "sky" },
];

const kinds = [
  { id: "repair", label: "Popravka" },
  { id: "upgrade", label: "Dorada" },
];

export function ServiceBook() {
  const { activeCar, repairs, plans, saveRepair, deleteRepair, savePlan, deletePlan } = useApp();
  const [repair, setRepair] = useState(null);
  const [plan, setPlan] = useState(null);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-mute">
            {activeCar.plate} · {activeCar.brand} {activeCar.model}
          </p>
          <h1 className="mt-2 text-[40px] leading-none tracking-tight">Servisna knjiga</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              setPlan({
                id: uid("plan"),
                carId: activeCar.id,
                title: "",
                priority: "medium",
                cost: "",
                note: "",
                fresh: true,
              })
            }
          >
            <Plus size={16} /> Plan
          </Button>
          <Button
            onClick={() =>
              setRepair({
                id: uid("repair"),
                carId: activeCar.id,
                partName: "",
                mileage: activeCar.mileage,
                partBrand: "",
                partNumber: "",
                date: todayIso(),
                kind: "repair",
                fresh: true,
              })
            }
          >
            <Plus size={16} /> Dodaj unos
          </Button>
        </div>
      </header>

      <section>
        <SectionTitle index="01" title="Istorija" />
        <div className="overflow-hidden rounded-card bg-white shadow-card">
          {repairs.length ? (
            repairs.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRepair(item)}
                className={`flex w-full flex-wrap items-center gap-3 px-4 py-4 text-left hover:bg-[#F7FAF8] sm:flex-nowrap ${index ? "border-t border-[#F0F3F2]" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[16px]">{item.partName}</p>
                  <p className="mt-1 text-[13px] text-mute">
                    {[item.partBrand, item.partNumber].filter(Boolean).join(" · ") || "Bez marke dela"}
                  </p>
                </div>
                <span className="font-mono text-[13px] text-mute">{formatKm(item.mileage)}</span>
                <span className="text-[13px] text-mute">{formatDate(item.date)}</span>
                <Pill tone={item.kind === "upgrade" ? "lilac" : "mint"}>
                  {item.kind === "upgrade" ? "Dorada" : "Popravka"}
                </Pill>
              </button>
            ))
          ) : (
            <p className="px-5 py-8 text-[15px] text-mute">Nema unosa. Dodaj prvi servis ili doradu.</p>
          )}
        </div>
      </section>

      <section>
        <SectionTitle index="02" title="Planirano" />
        <div className="grid gap-3 lg:grid-cols-3">
          {priorities.map((column) => {
            const items = plans.filter((item) => item.priority === column.id);
            return (
              <div key={column.id} className="rounded-card bg-white/60 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <Pill tone={column.tone}>{column.label}</Pill>
                  <span className="font-mono text-[12px] text-mute">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.length ? (
                    items.map((item) => (
                      <article key={item.id} className="rounded-2xl bg-white p-4 shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[16px]">{item.title}</h3>
                          <button
                            type="button"
                            aria-label="Obriši plan"
                            onClick={() => deletePlan(item.id)}
                            className="text-mute hover:text-danger"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="mt-2 font-mono text-[14px]">{formatRsd(item.cost)}</p>
                        {item.note ? <p className="mt-2 text-[13px] leading-5 text-mute">{item.note}</p> : null}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {priorities.map((choice) => (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => savePlan({ ...item, priority: choice.id })}
                              className={`rounded-full px-2.5 py-1 text-[12px] ${item.priority === choice.id ? "bg-ink text-white" : "bg-[#F3F6F4] text-mute"}`}
                            >
                              {choice.label}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPlan(item)}
                          className="mt-3 text-[13px] text-mute hover:text-ink"
                        >
                          Izmeni
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="px-2 py-4 text-[13px] text-mute">Nema planova.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {repair ? (
        <RepairModal
          initial={repair}
          onClose={() => setRepair(null)}
          onSave={(next) => {
            saveRepair(next);
            setRepair(null);
          }}
          onDelete={() => {
            deleteRepair(repair.id);
            setRepair(null);
          }}
        />
      ) : null}
      {plan ? (
        <PlanModal
          initial={plan}
          onClose={() => setPlan(null)}
          onSave={(next) => {
            savePlan(next);
            setPlan(null);
          }}
          onDelete={() => {
            if (!plan.fresh) deletePlan(plan.id);
            setPlan(null);
          }}
        />
      ) : null}
    </div>
  );
}

function RepairModal({ initial, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal title={initial.fresh ? "Novi unos" : "Izmena unosa"} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const mileage = Number(form.mileage);
          if (!form.partName.trim() || !form.date || form.mileage === "" || !Number.isFinite(mileage)) {
            setError("Naziv dela, datum i kilometraža su obavezni.");
            return;
          }
          const { fresh, ...repair } = form;
          onSave({ ...repair, partName: form.partName.trim(), mileage: Math.round(mileage) });
        }}
      >
        <div className="grid grid-cols-2 rounded-full bg-[#EEF3F0] p-1">
          {kinds.map((kind) => (
            <button
              key={kind.id}
              type="button"
              onClick={() => set("kind", kind.id)}
              className={`h-10 rounded-full text-[14px] ${form.kind === kind.id ? "bg-ink text-white" : "text-mute"}`}
            >
              {kind.label}
            </button>
          ))}
        </div>
        <Field label="Naziv dela" value={form.partName} onChange={(event) => set("partName", event.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Kilometraža"
            type="number"
            min="0"
            value={form.mileage}
            onChange={(event) => set("mileage", event.target.value)}
          />
          <Field label="Datum" type="date" value={form.date} onChange={(event) => set("date", event.target.value)} />
        </div>
        <Field
          label="Marka dela"
          value={form.partBrand}
          onChange={(event) => set("partBrand", event.target.value)}
          hint="Opciono, npr. Lemförder ili Garrett."
        />
        <Field
          label="OE / OEM broj"
          value={form.partNumber}
          onChange={(event) => set("partNumber", event.target.value)}
          hint="Opciono."
          error={error}
        />
        <div className="flex items-center justify-between gap-2 pt-2">
          {initial.fresh ? <span /> : (
            <Button variant="danger" onClick={onDelete}>
              <X size={16} /> Obriši
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit">
              <Check size={16} /> Sačuvaj
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function PlanModal({ initial, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal title={initial.fresh ? "Novi plan" : "Izmena plana"} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const cost = Number(form.cost);
          if (!form.title.trim() || form.cost === "" || !Number.isFinite(cost) || cost < 0) {
            setError("Naziv i procenjeni trošak su obavezni.");
            return;
          }
          const { fresh, ...plan } = form;
          onSave({ ...plan, title: form.title.trim(), cost: Math.round(cost) });
        }}
      >
        <Field label="Naziv" value={form.title} onChange={(event) => set("title", event.target.value)} />
        <Field label="Prioritet" as="select" value={form.priority} onChange={(event) => set("priority", event.target.value)}>
          {priorities.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Field>
        <Field
          label="Procenjeni trošak (RSD)"
          type="number"
          min="0"
          value={form.cost}
          onChange={(event) => set("cost", event.target.value)}
        />
        <Field
          label="Napomena"
          as="textarea"
          value={form.note}
          onChange={(event) => set("note", event.target.value)}
          error={error}
        />
        <div className="flex items-center justify-between gap-2 pt-2">
          {initial.fresh ? <span /> : (
            <Button variant="danger" onClick={onDelete}>
              <X size={16} /> Obriši
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit">
              <Check size={16} /> Sačuvaj
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
