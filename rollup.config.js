import typescript from '@rollup/plugin-typescript';
import del from "rollup-plugin-delete";

export default {
  input: {
    index: "src/main/index.ts",
    preload: "src/main/preload.ts",
  }, // 输入文件
  output: {
    dir: "dist/main", // 输出文件
    format: "cjs", // 输出格式
    entryFileNames: "[name].cjs",
  },
  plugins: [
    del({ targets: "dist/main/*" }),
    // commonjs(),
    typescript({
      tsconfig: "src/main/tsconfig.json",
      module: "esnext",
    }), // 使用TypeScript插件
  ],
  external: ["node_modules", 'electron', 'path', 'dotenv', 'ws'],
};
