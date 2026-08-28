import fs from "node:fs";

const pages = await fetch("http://127.0.0.1:9336/json/list").then((response) =>
  response.json(),
);
const page = pages.find(
  (entry) => entry.type === "page" && entry.url.startsWith("http://127.0.0.1:3000/"),
);
if (!page) throw new Error("Portfolio page not found");

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let id = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(message.error);
  else request.resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const callId = ++id;
    pending.set(callId, { resolve, reject });
    socket.send(JSON.stringify({ id: callId, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
  });
  return result.result.value;
};

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});

await evaluate(`(() => {
  const section = document.getElementById("stack");
  window.scrollTo({ top: section.offsetTop + 220, behavior: "instant" });
  return true;
})()`);
await new Promise((resolve) => setTimeout(resolve, 1600));

const firstState = await evaluate(`(() => {
  const cards = [...document.querySelectorAll(".tech-stack-card")];
  const track = document.querySelector(".tech-stack__scroll-progress");
  return {
    innerWidth,
    innerHeight,
    scrollY,
    scrollWidth: document.documentElement.scrollWidth,
    cardCount: cards.length,
    visibleCards: cards.filter((card) => Number(getComputedStyle(card).opacity) > 0.98).length,
    cardTransforms: cards.map((card) => getComputedStyle(card).transform),
    progressTransform: getComputedStyle(track).transform,
  };
})()`);

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: false,
});
fs.writeFileSync(
  "C:/workspace/EduardoFerreira/.codex-stack-motion.png",
  Buffer.from(screenshot.data, "base64"),
);

await evaluate(`(() => {
  const grid = document.querySelector(".tech-stack__grid");
  window.scrollTo({ top: grid.offsetTop + grid.offsetHeight - innerHeight * 0.35, behavior: "instant" });
  return true;
})()`);
await new Promise((resolve) => setTimeout(resolve, 700));

const finalProgress = await evaluate(
  `getComputedStyle(document.querySelector(".tech-stack__scroll-progress")).transform`,
);

console.log(JSON.stringify({ firstState, finalProgress }, null, 2));
socket.close();
