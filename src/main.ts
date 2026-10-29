import "./style.css";
import { book, checkConnection, toMoscowTime, type Notice } from "./api";
import { consultants, topics } from "./consultants";

const storageKey = "booking-landing:function-url";

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Хранилище может быть недоступно (приватный режим), тогда адрес живёт до перезагрузки.
const storage = {
  get: () => {
    try {
      return localStorage.getItem(storageKey) ?? "";
    } catch {
      return "";
    }
  },
  set: (value: string) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // адрес останется в поле формы
    }
  },
};

const noticeStyles: Record<Notice["kind"], string> = {
  ok: "border-emerald-300 bg-emerald-50 text-emerald-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  error: "border-rose-300 bg-rose-50 text-rose-900",
};

const renderNotice = (container: HTMLElement, notice: Notice) => {
  const box = document.createElement("div");
  box.className = `rounded-lg border px-4 py-3 ${noticeStyles[notice.kind]}`;
  const title = document.createElement("p");
  title.className = "font-semibold";
  title.textContent = notice.title;
  box.append(title);
  for (const line of notice.details) {
    const item = document.createElement("p");
    item.className = "mt-1 break-words text-sm";
    item.textContent = line;
    box.append(item);
  }
  container.replaceChildren(box);
};

const renderConsultants = () => {
  const list = byId<HTMLUListElement>("consultant-list");
  for (const consultant of consultants) {
    const item = document.createElement("li");
    item.className = "flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm";
    const avatar = document.createElement("img");
    avatar.src = `${import.meta.env.BASE_URL}avatars/${consultant.avatar}.svg`;
    avatar.alt = "";
    avatar.className = "size-16 rounded-full bg-indigo-50";
    const text = document.createElement("div");
    const name = document.createElement("p");
    name.className = "font-semibold";
    name.textContent = consultant.name;
    const themes = document.createElement("p");
    themes.className = "text-sm text-slate-600";
    themes.textContent = consultant.topics.map((topic) => topics[topic]).join(", ");
    text.append(name, themes);
    item.append(avatar, text);
    list.append(item);
  }

  const select = byId<HTMLSelectElement>("topic");
  for (const [value, label] of Object.entries(topics)) {
    select.append(new Option(label, value));
  }
};

let functionUrl = storage.get();

const setConnected = (notice: Notice | null) => {
  const status = byId("stand-status");
  const submit = byId<HTMLButtonElement>("booking-submit");
  const hint = byId("booking-hint");
  const connected = notice?.kind === "ok";
  status.textContent = notice === null ? "не подключена" : notice.title.toLowerCase();
  status.className = `ml-2 ${connected ? "text-emerald-400" : "text-slate-400"}`;
  submit.disabled = functionUrl === "";
  hint.hidden = functionUrl !== "";
};

const connectForm = byId<HTMLFormElement>("connect");
const urlInput = connectForm.elements.namedItem("url") as HTMLInputElement;
urlInput.value = functionUrl;

connectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  functionUrl = urlInput.value.trim();
  storage.set(functionUrl);
  const notice = await checkConnection(functionUrl);
  renderNotice(byId("connect-notice"), notice);
  setConnected(notice);
});

const bookingForm = byId<HTMLFormElement>("booking-form");
bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const notice = await book(functionUrl, {
    name: String(data.get("name")),
    email: String(data.get("email")),
    topic: String(data.get("topic")),
    time: toMoscowTime(String(data.get("time"))),
  });
  renderNotice(byId("booking-notice"), notice);
});

renderConsultants();
setConnected(null);
