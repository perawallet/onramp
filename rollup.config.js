import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import {terser} from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: {
      index: "src/index.ts"
    },
    output: {
      dir: "dist",
      format: "esm",
      name: "PeraOnramp"
    },
    plugins: [
      image(),
      nodeResolve(),
      commonjs(),
      terser(),
      postcss(),
      typescript({
        exclude: "**/__tests__/**",
        clean: true
      }),
      json()
    ]
  }
];
