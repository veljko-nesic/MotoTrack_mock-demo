"use client";

import { useState } from "react";
import { Bell, Check, MapPin, Phone } from "lucide-react";
import { events, maintenanceTasks, shops } from "@/lib/data";
import { daysUntil, formatDate, formatKm, formatVin, greeting, taskStatus, uid } from "@/lib/format";
import { useApp } from "@/components/state";
import { Assistant } from "@/components/assistant";
import { OverdueBanner } from "@/components/overdue-banner";
import { Button, Card, Pill, Plate, SectionTitle, Stat } from "@/components/ui";

function registrationTone(days) {
  if (days < 0) return { tone: "red", label: "Isteklo" };
  if (days <= 45) return { tone: "amber", label: "Očekuje se" };
  return null;
}

function MileageEditor({ mileage, onSave }) {
  const [value, setValue] = useState(mileage);
  const [previous, setPrevious] = useState(mileage);
  if (mileage !== previous) {
    setPrevious(mileage);
    setValue(mileage);
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const next = Number(value);
        if (!Number.isFinite(next) || next < 0 || next > 2000000) return;
        onSave(Math.round(next));
      }}
    >
      <input
        aria-label="Trenutna kilometraža"
        type="number"
        min="0"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-10 w-32 rounded-full border border-[#E4EBE7] bg-[#FBFCFB] px-3 text-right font-mono text-[14px] outline-none focus:border-brand"
      />
      <Button type="submit" className="h-10 px-3">
        <Check size={15} /> Sačuvaj
      </Button>
    </form>
  );
}

export function Dashboard() {
  const { user, activeCar, cars, selectCar, photos, logs, setMileage, logMaintenance } = useApp();
  const rows = maintenanceTasks.map((task) => ({ task, status: taskStatus(activeCar, logs, task) }));
  const oil = rows.find((row) => row.task.id === "oil").status;
  const hero =
    photos.find((photo) => photo.carId === activeCar.id)?.imageUrl || activeCar.image;
  const registration = registrationTone(daysUntil(activeCar.registrationDate));
  const brandShops = shops[activeCar.brand] ?? [];
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[13px] text-mute">Auto Ranč / Garaža</p>
        <h1 className="mt-2 text-[40px] leading-none tracking-tight sm:text-[44px]">
          {greeting()}, {user.name}.
        </h1>
        <p className="mt-3 text-[16px] text-mute">
          {activeCar.brand} {activeCar.model} · {formatKm(activeCar.mileage)}
        </p>
      </header>

      <OverdueBanner
        rows={rows}
        defaultMileage={activeCar.mileage}
        onSave={(entry) => logMaintenance({ ...entry, id: uid("log"), carId: activeCar.id })}
      />

      <section>
        <SectionTitle index="01" title="Obaveštenja" />
        <div className="grid gap-3 lg:grid-cols-3">
          {sortedEvents.map((event, index) => (
            <article
              key={event.id}
              className={`rounded-card p-5 ${index === 0 ? "bg-[#FFF8EE] shadow-card lg:col-span-1" : "bg-white shadow-card"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <Pill tone="amber">Očekuje se</Pill>
                <Bell size={16} className="text-[#C4924A]" />
              </div>
              <h3 className="mt-4 text-[20px] tracking-tight">{event.title}</h3>
              <p className="mt-2 text-[14px]">
                {formatDate(event.date)} · {event.place}
              </p>
              <p className="mt-2 text-[14px] leading-6 text-mute">{event.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle index="02" title="Vozilo" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <Card className="overflow-hidden">
            <div className="relative h-52">
              <img src={hero} alt={`${activeCar.brand} ${activeCar.model}`} className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4">
                <Plate plate={activeCar.plate} />
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] text-mute">
                    {activeCar.year} · {activeCar.fuel} · {activeCar.engineCc} cc · {activeCar.hp} HP
                  </p>
                  <h3 className="mt-1 text-[28px] tracking-tight">
                    {activeCar.brand} {activeCar.model}
                  </h3>
                </div>
                <MileageEditor mileage={activeCar.mileage} onSave={(mileage) => setMileage(activeCar.id, mileage)} />
              </div>
              <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-mute">VIN · Geist Mono</p>
              <p className="mt-1 font-mono text-[18px] tracking-wide">{formatVin(activeCar.vin)}</p>
              <div className="mt-4 divide-y divide-[#F0F3F2]">
                <Stat label="Menjač">{activeCar.transmission}</Stat>
                <Stat label="Godište">{activeCar.year}</Stat>
                <Stat label="Registracija">
                  <span className="inline-flex items-center gap-2">
                    {formatDate(activeCar.registrationDate)}
                    {registration ? <Pill tone={registration.tone}>{registration.label}</Pill> : null}
                  </span>
                </Stat>
                <Stat label="Osiguranje">{formatDate(activeCar.insuranceDate)}</Stat>
                <Stat label="Kilometraža">
                  <span className="font-mono">{formatKm(activeCar.mileage)}</span>
                </Stat>
              </div>
            </div>
          </Card>

          <Card className="h-fit p-2">
            <p className="px-3 pb-2 pt-3 text-[13px] text-mute">Garaža</p>
            {cars.map((car) => {
              const active = car.id === activeCar.id;
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => selectCar(car.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${active ? "bg-mint" : "hover:bg-[#F7FAF8]"}`}
                >
                  <img src={car.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px]">
                      {car.brand} {car.model}
                    </span>
                    <span className="mt-1 block">
                      <Plate plate={car.plate} />
                    </span>
                  </span>
                  {active ? <Pill>Aktivno</Pill> : null}
                </button>
              );
            })}
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle index="03" title={`Preporuke za ${activeCar.brand}`} />
        <div className="grid gap-3 md:grid-cols-3">
          {brandShops.map((shop) => (
            <Card key={shop.name} className="flex flex-col p-5">
              <Pill tone="sky">{shop.kind}</Pill>
              <h3 className="mt-4 text-[20px] tracking-tight">{shop.name}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-6 text-mute">{shop.text}</p>
              <p className="mt-4 flex items-start gap-2 text-[14px]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-mute" />
                {shop.address}
              </p>
              <p className="mt-2 flex items-center gap-2 font-mono text-[14px]">
                <Phone size={16} className="text-mute" />
                {shop.phoneLabel}
              </p>
              <a href={`tel:${shop.phone}`} className="mt-4">
                <Button className="w-full">Pozovi</Button>
              </a>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle index="04" title="Razgovor" />
        <Assistant key={activeCar.id} car={activeCar} oil={oil} shop={brandShops[0]} />
      </section>
    </div>
  );
}
