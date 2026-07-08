import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
const vw = parseInt(process.argv[4] || "1440", 10);
const vh = parseInt(process.argv[5] || "900", 10);

const dir = "D:/web-ROI/temporary screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter((f) => /^screenshot-\d+/.test(f));
const nextN = existing.reduce((max, f) => {
  const m = f.match(/^screenshot-(\d+)/);
  return m ? Math.max(max, parseInt(m[1], 10) + 1) : max;
}, 1);

const fileName = `screenshot-${nextN}${label ? "-" + label : ""}.png`;
const outPath = path.join(dir, fileName);

const browser = await puppeteer.launch({
  executablePath: "C:/Users/User/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: vw, height: vh });
await page.goto(url, { waitUntil: "networkidle0" });
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved ${outPath}`);
