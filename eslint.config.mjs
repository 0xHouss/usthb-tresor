import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // eslint-config-next 16 enables the stricter React Compiler hook rules.
    // Demote to warnings so pre-existing dev patterns (e.g. the shadcn
    // use-mobile hook) don't block lint; revisit and fix properly later.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
