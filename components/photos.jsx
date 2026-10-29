"use client";

import { useState } from "react";
import { Car, Check, Plus, X } from "lucide-react";
import { useApp } from "@/components/state";
import { Button, Field, Modal } from "@/components/ui";
import { formatDate, todayIso, uid } from "@/lib/format";

function Frame({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-mint to-peach text-mute">
        <Car size={28} />
      </div>
    );
  }
  return <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} />;
}

export function Photos() {
  const { activeCar, photos, savePhoto, deletePhoto } = useApp();
  const [draft, setDraft] = useState(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-mute">
            {activeCar.brand} {activeCar.model}
          </p>
          <h1 className="mt-2 text-[40px] leading-none tracking-tight">Verzije i fotografije</h1>
          <p className="mt-3 max-w-xl text-[15px] text-mute">
            Hronologija izgleda: boja, bodykit, felne, stance. Najnovija slika stoji prva.
          </p>
        </div>
        <Button
          onClick={() =>
            setDraft({
              id: uid("photo"),
              carId: activeCar.id,
              title: "",
              date: todayIso(),
              imageUrl: "",
              fresh: true,
            })
          }
        >
          <Plus size={16} /> Dodaj fotografiju
        </Button>
      </header>

      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-card bg-white shadow-card">
              <div className="aspect-[4/3]">
                <Frame src={photo.imageUrl} alt={photo.title} />
              </div>
              <div className="p-4">
                <h2 className="text-[18px] tracking-tight">{photo.title}</h2>
                <p className="mt-1 text-[13px] text-mute">{formatDate(photo.date)}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" className="h-10 px-3" onClick={() => setDraft(photo)}>
                    Izmeni
                  </Button>
                  <Button variant="danger" className="h-10 px-3" onClick={() => deletePhoto(photo.id)}>
                    <X size={15} /> Obriši
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-card bg-white px-5 py-10 text-[15px] text-mute shadow-card">
          Nema fotografija za ovo vozilo.
        </div>
      )}

      {draft ? (
        <PhotoModal
          initial={draft}
          onClose={() => setDraft(null)}
          onSave={(photo) => {
            savePhoto(photo);
            setDraft(null);
          }}
        />
      ) : null}
    </div>
  );
}

function PhotoModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal title={initial.fresh ? "Nova fotografija" : "Izmena fotografije"} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.title.trim() || !form.date || !form.imageUrl.trim()) {
            setError("Naslov, datum i adresa slike su obavezni.");
            return;
          }
          try {
            const url = new URL(form.imageUrl.trim());
            if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("bad");
          } catch {
            setError("Adresa slike mora biti pun URL.");
            return;
          }
          const { fresh, ...photo } = form;
          onSave({ ...photo, title: form.title.trim(), imageUrl: form.imageUrl.trim() });
        }}
      >
        <Field label="Naslov" value={form.title} onChange={(event) => set("title", event.target.value)} />
        <Field label="Datum" type="date" value={form.date} onChange={(event) => set("date", event.target.value)} />
        <Field
          label="Adresa slike"
          value={form.imageUrl}
          onChange={(event) => set("imageUrl", event.target.value)}
          placeholder="https://"
          error={error}
        />
        {form.imageUrl ? (
          <div className="aspect-video overflow-hidden rounded-2xl">
            <Frame src={form.imageUrl} alt="" />
          </div>
        ) : null}
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
