import swc from "@rollup/plugin-swc";
import { dts } from "rollup-plugin-dts";

export default [
  {
    input: "packages/core/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
      },
      {
        file: "dist/index.mjs",
        format: "esm",
      },
    ],
    plugins: [swc()],
  },
  {
    input: "packages/react/index.ts",
    output: [
      {
        file: "dist/react/index.cjs",
        format: "cjs",
      },
      {
        file: "dist/react/index.mjs",
        format: "esm",
      },
    ],
    plugins: [swc()],
  },
  {
    input: "./packages/core/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "./packages/react/index.ts",
    output: [{ file: "dist/react/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
