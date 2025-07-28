import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch((err) => {
        console.error("Failed to copy text: ", err);
    });
    toast.success("Copied to clipboard");
}

export function readAloud(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
