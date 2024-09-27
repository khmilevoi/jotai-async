import swc from "@rollup/plugin-swc";
import { dts } from "rollup-plugin-dts";

export default [{
  input: "src/index.ts",
  output: [{
    file: "dist/index.cjs",
    format: "cjs"
  }, {
    file: "dist/index.mjs",
    format: "esm"
  }],
  plugins: [swc()]
}, {
  input: "./src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()]
}];