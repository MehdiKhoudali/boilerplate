import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const FADE_UP_ANIMATION = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};