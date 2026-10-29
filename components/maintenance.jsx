"use client";

import { maintenanceTasks } from "@/lib/data";
import { formatDate, formatKm, taskStatus, uid } from "@/lib/format";
import { useApp } from "@/components/state";
import { OverdueBanner } from "@/components/overdue-banner";
import { Pill } from "@/components/ui";

export function Maintenance() {
  const { activeCar, logs, logMaintenance } = useApp();
  const rows = maintenanceTasks.map((task) => ({ task, status: taskStatus(activeCar, logs, task) }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[13px] text-mute">
          {activeCar.brand} {activeCar.model} · {formatKm(activeCar.mileage)}
        </p>
        <h1 className="mt-2 text-[40px] leading-none tracking-tight">Redovno održavanje</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-mute">
          Intervali se mere od poslednje zabeležene zamene. Ulje je na 10.000 km. Ako je trenutna kilometraža prešla rok, crveno upozorenje pokazuje tačno prekoračenje.
        </p>
      </header>

      <OverdueBanner
        rows={rows}
        defaultMileage={activeCar.mileage}
        onSave={(entry) => logMaintenance({ ...entry, id: uid("log"), carId: activeCar.id })}
      />

      <div className="overflow-hidden rounded-card bg-white shadow-card">
        {rows.map((row, index) => {
          const close = !row.status.overdue && row.status.remaining <= 2000;
          return (
            <article key={row.task.id} className={`px-5 py-4 ${index ? "border-t border-[#F0F3F2]" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16px]">{row.task.name}</h2>
                  <p className="mt-1 text-[13px] text-mute">Svakih {formatKm(row.task.intervalKm)}</p>
                </div>
                {row.status.overdue ? (
                  <Pill tone="red">+{formatKm(row.status.excess)}</Pill>
                ) : close ? (
                  <Pill tone="amber">Očekuje se</Pill>
                ) : (
                  <Pill>U roku</Pill>
                )}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF2F0]">
                <div
                  className={`h-full rounded-full ${row.status.overdue ? "bg-danger" : "bg-brand"}`}
                  style={{ width: `${row.status.progress}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[13px] text-mute">
                <span>Poslednji put {formatKm(row.status.lastKm)}</span>
                <span>{row.status.last ? formatDate(row.status.last.date) : "Nema zapisa"}</span>
                <span>{row.status.overdue ? `Rok je bio ${formatKm(row.status.dueKm)}` : `Sledeći na ${formatKm(row.status.dueKm)}`}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
