export function cleanText(text?: string | null): string {
    if (!text) return "";
    return text
        .replace(/\s+/g, " ") // Collapse all whitespace (tabs, newlines, multiple spaces) into single space
        .replace(/ ?([:.,!]) ?/g, "$1 ") // Trim space around punctuation
        .replace(/\s{2,}/g, " ") // Extra space to single
        .trim(); // Remove leading/trailing whitespace
}
