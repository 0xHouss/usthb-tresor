import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

// Flattens a catalogue to "a.b.c" keys, each mapped to its sorted ICU arguments.
function flatten(messages: object, prefix = ""): Record<string, string[]> {
  return Object.entries(messages).reduce<Record<string, string[]>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      const args = [...value.matchAll(/\{(\w+)/g)].map(m => m[1]);
      acc[path] = [...new Set(args)].sort();
    } else {
      Object.assign(acc, flatten(value, path));
    }
    return acc;
  }, {});
}

describe("message catalogues", () => {
  const frKeys = flatten(fr);
  const enKeys = flatten(en);

  it("have the same keys in French and English", () => {
    expect(Object.keys(enKeys).sort()).toEqual(Object.keys(frKeys).sort());
  });

  it("use the same ICU arguments in both languages", () => {
    for (const key of Object.keys(frKeys)) {
      expect(enKeys[key], key).toEqual(frKeys[key]);
    }
  });
});
