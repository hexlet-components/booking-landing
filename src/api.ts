export type Notice = { kind: "ok" | "warn" | "error"; title: string; details: string[] };

export type BookingRequest = { name: string; email: string; topic: string; time: string };

const corsHint =
  "Браузер не получил ответ. Чаще всего у функции нет заголовков CORS или она не публичная.";

const readErrors = (body: unknown): string[] => {
  const errors = (body as { errors?: unknown } | null)?.errors;
  return Array.isArray(errors) ? errors.map(String) : [];
};

const parse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const send = async (url: string, payload: unknown, fetchImpl: typeof fetch) => {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  return { status: response.status, text, body: parse(text) };
};

// Пустая заявка ничего не создаёт в календаре: подключённая функция отвечает
// на неё 400 с ошибками по полям.
export const checkConnection = async (
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Notice> => {
  let result;
  try {
    result = await send(url, {}, fetchImpl);
  } catch {
    return { kind: "error", title: "Функция недоступна", details: [corsHint] };
  }

  if (result.status === 400 && readErrors(result.body).length > 0) {
    return { kind: "ok", title: "Функция подключена", details: [] };
  }

  return {
    kind: "warn",
    title: `Функция ответила ${result.status}, а на пустую заявку ждём 400 с ошибками`,
    details: [result.text],
  };
};

const formatMoscow = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

export const book = async (
  url: string,
  request: BookingRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<Notice> => {
  let result;
  try {
    result = await send(url, request, fetchImpl);
  } catch {
    return { kind: "error", title: "Заявка не отправлена", details: [corsHint] };
  }

  const booking = result.body as { consultant?: string; start?: string } | null;
  if (result.status === 201 && booking?.consultant && booking.start) {
    return {
      kind: "ok",
      title: `Вы записаны к консультанту ${booking.consultant} на ${formatMoscow(booking.start)} по Москве`,
      details: ["Приглашение придёт на почту."],
    };
  }

  const errors = readErrors(result.body);
  return {
    kind: result.status >= 500 ? "error" : "warn",
    title: `Запись не создана, функция ответила ${result.status}`,
    details: errors.length > 0 ? errors : [result.text],
  };
};

// Поле datetime-local отдаёт время без пояса, а функция ждёт его явно.
export const toMoscowTime = (local: string) => `${local}:00+03:00`;
