export function formatNumber(value) {
  return new Intl.NumberFormat("sr-Latn-RS").format(value);
}

export function formatKm(value) {
  return `${formatNumber(value)} km`;
}

export function formatRsd(value) {
  return `${formatNumber(value)} RSD`;
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

export function formatVin(vin) {
  return `${vin.slice(0, 4)} ${vin.slice(4, 8)} ${vin.slice(8, 12)} ${vin.slice(12)}`;
}

export function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Dobro jutro";
  if (hour < 18) return "Dobar dan";
  return "Dobro veče";
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function taskStatus(car, logs, task) {
  const last = logs
    .filter((item) => item.carId === car.id && item.taskId === task.id)
    .sort((a, b) => b.mileage - a.mileage)[0];
  const lastKm = last?.mileage ?? 0;
  const dueKm = lastKm + task.intervalKm;
  const delta = car.mileage - dueKm;
  return {
    last,
    lastKm,
    dueKm,
    excess: Math.max(0, delta),
    remaining: Math.max(0, -delta),
    overdue: delta > 0,
    progress: Math.max(0, Math.min(100, ((car.mileage - lastKm) / task.intervalKm) * 100)),
  };
}

export function uid(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
