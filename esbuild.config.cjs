const { build } = require("esbuild");
const fs = require("fs");
const path = require("path");

const outdir = "./dist/main";

// 清空输出目录
fs.rmSync(outdir, { recursive: true, force: true });

build({
  entryPoints: ["./src/main/index.ts", "./src/main/preload.ts"],
  outdir,
  outExtension: { ".js": ".cjs" },
  bundle: true,
  minify: true,
  platform: "node", // 或 'browser'，根据你的需求
  target: "esnext", // 或其他目标，如 'es6'
  format: "cjs", // 或 'esm'，根据你的需求
  // outfile: path.resolve(outdir, "main.cjs"),
  external: ["node_modules", "electron", "path", "dotenv", "ws"],
  tsconfig: "./src/main/tsconfig.json",
}).catch((err) => {
  console.log("build error", err);
  process.exit(1);
});
