"use client";

import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { Button, Field, Modal } from "@/components/ui";
import { formatKm, todayIso } from "@/lib/format";

export function OverdueBanner({ rows, defaultMileage, onSave }) {
  const overdue = rows.filter((row) => row.status.overdue);
  const [task, setTask] = useState(null);
  if (!overdue.length) return null;

  return (
    <>
      <section className="rounded-card border border-[#F0C2C2] bg-[#FFF5F5] p-5 shadow-card">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F8DADA] text-[#C43636]">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p className="text-[13px] text-[#C43636]">Kasni servis</p>
            <h2 className="text-[26px] tracking-tight text-ink">Održavanje je prekoračeno</h2>
            <p className="mt-1 max-w-2xl text-[15px] text-[#8A5A5A]">
              Trenutna kilometraža je prošla očekivani interval. Broj ispod je tačno prekoračenje od poslednje zabeležene zamene.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {overdue.map((row) => (
            <li
              key={row.task.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
            >
              <div>
                <p className="text-[15px]">{row.task.name}</p>
                <p className="mt-1 font-mono text-[13px] text-mute">
                  Poslednji put {formatKm(row.status.lastKm)} · rok {formatKm(row.status.dueKm)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[18px] text-[#C43636]">+{formatKm(row.status.excess)}</span>
                <Button variant="secondary" onClick={() => setTask(row.task)}>
                  Evidentiraj
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {task ? (
        <LogModal
          task={task}
          defaultMileage={defaultMileage}
          onClose={() => setTask(null)}
          onSave={(entry) => {
            onSave(entry);
            setTask(null);
          }}
        />
      ) : null}
    </>
  );
}

function LogModal({ task, defaultMileage, onClose, onSave }) {
  const [date, setDate] = useState(todayIso());
  const [mileage, setMileage] = useState(String(defaultMileage));
  const [error, setError] = useState("");

  return (
    <Modal title={task.name} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const value = Number(mileage);
          if (!date || !Number.isFinite(value) || value < 0) {
            setError("Unesi datum i kilometražu.");
            return;
          }
          onSave({ taskId: task.id, mileage: Math.round(value), date });
        }}
      >
        <Field label="Datum" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <Field
          label="Kilometraža"
          type="number"
          min="0"
          value={mileage}
          onChange={(event) => setMileage(event.target.value)}
          error={error}
          hint="Ako je zamena u poslednjem intervalu, crveno upozorenje nestaje."
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Otkaži
          </Button>
          <Button type="submit">
            <Check size={16} /> Sačuvaj
          </Button>
        </div>
      </form>
    </Modal>
  );
}
