import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-polyfill-node";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import typescript from '@rollup/plugin-typescript';
import packageJson from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [
    json(),
    commonjs(),
    nodePolyfills(),
    nodeResolve(),
    typescript(),
    babel({
      presets: ["@babel/preset-env"],
      babelHelpers: "bundled",
    }),
  ],
  external: [...Object.keys(packageJson.dependencies)],
};
