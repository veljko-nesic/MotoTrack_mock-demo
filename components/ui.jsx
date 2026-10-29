"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const buttonSizes = {
  md: "h-12 px-4 text-[15px]",
  lg: "h-14 px-5 text-[16px]",
};

const buttonVariants = {
  primary: "bg-ink text-white hover:bg-[#24312b]",
  secondary: "bg-white text-ink shadow-card hover:bg-[#fbfcfb]",
  ghost: "bg-transparent text-mute hover:text-ink",
  danger: "bg-danger text-white hover:bg-[#d03d42]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed ${buttonSizes[size]} ${disabled ? "bg-[#E7ECE9] text-[#93A099]" : buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Orb({ size = 28, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 32% 28%, #d9ffe9 0%, #5ee0aa 26%, #1DB876 58%, #0c8a56 100%)",
        boxShadow:
          "inset 0 5px 8px rgba(255,255,255,0.55), inset 0 -8px 12px rgba(6,70,45,0.28), 0 8px 16px rgba(29,184,118,0.28)",
      }}
    />
  );
}

export function Boot() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <Orb size={64} />
        <p className="text-[15px] text-mute">Učitavanje</p>
      </div>
    </div>
  );
}

const pillTones = {
  mint: "bg-mint text-[#0E7A4B]",
  peach: "bg-peach text-[#9A6230]",
  sky: "bg-sky text-[#2A4E9E]",
  lilac: "bg-lilac text-[#5B4B9A]",
  pink: "bg-[#FDE8F3] text-[#9D3B6E]",
  red: "bg-[#FDECEC] text-[#C43636]",
  amber: "bg-[#FFF4CC] text-[#8A6412]",
  ink: "bg-ink text-white",
};

export function Pill({ children, tone = "mint", className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-none ${pillTones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Plate({ plate }) {
  return (
    <span className="inline-flex items-stretch overflow-hidden rounded-[7px] border border-[#D7DEE8] bg-white shadow-sm">
      <span className="flex items-center bg-[#2457D6] px-1.5 text-[9px] font-bold tracking-[0.14em] text-white">
        SRB
      </span>
      <span className="px-2 py-1 font-mono text-[13px] font-medium tracking-wide text-ink">{plate}</span>
    </span>
  );
}

export function Card({ className = "", children }) {
  return <section className={`rounded-card bg-white shadow-card ${className}`}>{children}</section>;
}

export function SectionTitle({ index, title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[13px] text-mute">{index}</span>
        <h2 className="text-[22px] tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Field({ label, as, hint, error, ...props }) {
  const shared =
    "w-full rounded-2xl border border-[#E4EBE7] bg-[#FBFCFB] px-4 text-[15px] text-ink outline-none transition placeholder:text-[#A7B2AD] focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15";
  const Comp = as === "textarea" ? "textarea" : as === "select" ? "select" : "input";
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-[13px] text-mute">{label}</span> : null}
      <Comp className={`${shared} ${as === "textarea" ? "min-h-24 py-3" : "h-12"}`} {...props} />
      {error ? <span className="mt-1.5 block text-[13px] text-danger">{error}</span> : null}
      {!error && hint ? <span className="mt-1.5 block text-[13px] text-mute">{hint}</span> : null}
    </label>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#0F1A15]/35 p-4 backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-card bg-white p-6 shadow-soft"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[22px] tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-mute hover:bg-[#F4F7F5] hover:text-ink"
            aria-label="Zatvori"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stat({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[14px] text-mute">{label}</span>
      <div className="text-right text-[15px]">{children}</div>
    </div>
  );
}
