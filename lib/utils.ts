import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function titleCase(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}
