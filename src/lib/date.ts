// src/lib/dates.ts

// Mois abrégés en français, tels qu'utilisés dans nos données mock ("01 sept. 24")
const MONTHS: Record<string, number> = {
  "janv": 0, "févr": 1, "mars": 2, "avr": 3, "mai": 4, "juin": 5,
  "juil": 6, "août": 7, "sept": 8, "oct": 9, "nov": 10, "déc": 11,
};

// Convertit "01 sept. 24" en objet Date
export function parseFrenchDate(value: string): Date | null {
  const parts = value.trim().split(" ");
  if (parts.length < 3) return null;

  const [dayRaw, monthRaw, yearRaw] = parts;
  const month = MONTHS[monthRaw.replace(".", "").toLowerCase()];
  if (month === undefined) return null;

  const day = parseInt(dayRaw, 10);
  const year = 2000 + parseInt(yearRaw, 10);
  if (isNaN(day) || isNaN(year)) return null;

  return new Date(year, month, day);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Nombre de jours entre deux dates (arrondi)
export function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

// "Durée restante" affichée sur le profil : soit "Terminé", soit "X jours restants"
export function dureeRestante(dateFin: string): string {
  const end = parseFrenchDate(dateFin);
  if (!end) return "—";

  const today = new Date();
  const diff = daysBetween(today, end);

  if (diff <= 0) return "Terminé";
  if (diff === 1) return "1 jour restant";
  return `${diff} jours restants`;
}

// Durée totale du stage, en jours
export function dureeTotaleJours(dateDebut: string, dateFin: string): number | null {
  const start = parseFrenchDate(dateDebut);
  const end = parseFrenchDate(dateFin);
  if (!start || !end) return null;
  return daysBetween(start, end);
}