import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { createPassword, type PasswordOptions } from "./password-generator.service";

export function PasswordGeneratorPage(): JSX.Element {
  const [version, setVersion] = useState(0);
  const [options, setOptions] = useState<PasswordOptions>({
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    length: 20,
  });
  const result = useMemo(() => {
    void version;

    return createPassword(options);
  }, [options, version]);

  function updateOption(key: keyof PasswordOptions, value: boolean | number): void {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  async function copyPassword(): Promise<void> {
    await navigator.clipboard.writeText(result.password);
  }

  return (
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[15px] font-semibold text-slate-950">Password Generator</h1>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Crypto
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
          Generated password
        </p>
        <p className="mt-3 break-all font-mono text-lg font-semibold leading-8 text-slate-950">
          {result.password}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setVersion((value) => value + 1)}
            size="sm"
            variant="secondary"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Generate
          </Button>
          <Button onClick={() => void copyPassword()} size="sm" variant="ghost">
            <Copy aria-hidden="true" className="h-4 w-4" />
            Copy
          </Button>
          <span className="rounded-md bg-sky-50 px-2 py-1 text-[12px] font-semibold text-sky-700 ring-1 ring-sky-100">
            {result.strength}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <label className="block rounded-md border border-slate-200 p-3">
          <span className="text-[12px] font-semibold text-slate-500">Length</span>
          <input
            className="mt-3 w-full accent-sky-600"
            max={64}
            min={4}
            onChange={(event) => updateOption("length", Number(event.target.value))}
            type="range"
            value={options.length}
          />
          <span className="font-mono text-sm text-slate-950">{options.length}</span>
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["includeLowercase", "Lowercase"],
            ["includeUppercase", "Uppercase"],
            ["includeNumbers", "Numbers"],
            ["includeSymbols", "Symbols"],
          ].map(([key, label]) => (
            <label
              className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              key={key}
            >
              <input
                checked={Boolean(options[key as keyof PasswordOptions])}
                className="accent-sky-600"
                onChange={(event) =>
                  updateOption(key as keyof PasswordOptions, event.target.checked)
                }
                type="checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
