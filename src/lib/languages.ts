export const LANGUAGES = [
  { code: "auto", label: "Auto-detect", flag: "🌐", bcp47: "" },
  { code: "en", label: "English", flag: "🇬🇧", bcp47: "en-US" },
  { code: "it", label: "Italiano", flag: "🇮🇹", bcp47: "it-IT" },
  { code: "ur", label: "اردو", flag: "🇵🇰", bcp47: "ur-PK" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

export const langLabel = (code: string) =>
  LANGUAGES.find((l) => l.code === code)?.label ?? code;
export const langBcp47 = (code: string) =>
  LANGUAGES.find((l) => l.code === code)?.bcp47 ?? "en-US";
export const langFlag = (code: string) =>
  LANGUAGES.find((l) => l.code === code)?.flag ?? "🌐";
