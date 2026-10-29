"use client";

import { Gauge, Images, RotateCcw, UserRound, Wrench } from "lucide-react";
import { useApp } from "@/components/state";
import { Dashboard } from "@/components/dashboard";
import { ServiceBook } from "@/components/service-book";
import { Photos } from "@/components/photos";
import { Maintenance } from "@/components/maintenance";
import { Profile } from "@/components/profile";
import { Orb, Plate } from "@/components/ui";

const items = [
  { id: "dashboard", label: "Garaža", icon: "orb" },
  { id: "service", label: "Servisna knjiga", icon: Wrench },
  { id: "photos", label: "Fotografije", icon: Images },
  { id: "maintenance", label: "Održavanje", icon: Gauge },
  { id: "profile", label: "Profil", icon: UserRound },
];

function NavButton({ item, active, onClick, compact = false }) {
  const Icon = item.icon === "orb" ? null : item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={`grid place-items-center rounded-2xl text-ink transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${compact ? "h-12 w-12" : "h-12 w-12"} ${active ? "bg-mint" : "hover:bg-[#F3F7F5]"}`}
    >
      {item.icon === "orb" ? <Orb size={22} /> : <Icon size={20} strokeWidth={1.75} />}
      <span className="sr-only">{item.label}</span>
    </button>
  );
}

export function Shell() {
  const { view, setView, cars, activeCar, selectCar, reset } = useApp();
  const screen = {
    dashboard: <Dashboard />,
    service: <ServiceBook />,
    photos: <Photos />,
    maintenance: <Maintenance />,
    profile: <Profile />,
  }[view];

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col items-center gap-2 border-r border-[#E7EEEA] bg-white/75 py-4 backdrop-blur md:flex">
        {items.map((item) => (
          <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
        ))}
      </aside>

      <div className="md:pl-[76px]">
        <header className="sticky top-0 z-20 bg-[#F6F8F7]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <Orb size={26} />
              <span className="truncate text-[18px] tracking-tight">auto ranč</span>
              <span className="hidden rounded-full bg-white px-2 py-0.5 text-[12px] text-mute shadow-sm sm:inline">
                Demo
              </span>
            </div>
            <button
              type="button"
              onClick={() => reset(true)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] hover:bg-white"
            >
              <RotateCcw size={16} /> Resetuj
            </button>
          </div>
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3 sm:px-6">
            {cars.map((car) => {
              const active = car.id === activeCar.id;
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => selectCar(car.id)}
                  aria-pressed={active}
                  className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 ${active ? "bg-white shadow-card" : "hover:bg-white/70"}`}
                >
                  <Plate plate={car.plate} />
                  <span className="text-[13px]">{car.model}</span>
                </button>
              );
            })}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-28 pt-2 sm:px-6">{screen}</main>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 md:hidden">
        <nav className="flex items-center gap-1 rounded-full bg-white px-2 py-2 shadow-soft">
          {items.map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} compact />
          ))}
        </nav>
      </div>
    </div>
  );
}
