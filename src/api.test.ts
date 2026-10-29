import { describe, expect, test } from "vitest";

import { book, checkConnection, toMoscowTime } from "./api";

const reply =
  (status: number, body: unknown): typeof fetch =>
  async () =>
    new Response(typeof body === "string" ? body : JSON.stringify(body), { status });

const offline: typeof fetch = async () => {
  throw new TypeError("Failed to fetch");
};

const request = {
  name: "Мария",
  email: "maria@example.com",
  topic: "frontend",
  time: "2026-11-05T12:00:00+03:00",
};

describe("checkConnection", () => {
  test("400 с ошибками значит, что функция подключена", async () => {
    const notice = await checkConnection("u", reply(400, { errors: ["name: укажите имя"] }));
    expect(notice.kind).toBe("ok");
  });

  test("недошедший запрос объясняется через CORS", async () => {
    const notice = await checkConnection("u", offline);
    expect(notice.kind).toBe("error");
    expect(notice.details.join()).toContain("CORS");
  });

  test("другой ответ показывается с кодом и телом", async () => {
    const notice = await checkConnection("u", reply(200, { method: "POST" }));
    expect(notice.kind).toBe("warn");
    expect(notice.title).toContain("200");
    expect(notice.details).toEqual(['{"method":"POST"}']);
  });
});

describe("book", () => {
  test("201 называет консультанта и время по Москве", async () => {
    const notice = await book(
      "u",
      request,
      reply(201, { consultant: "Ирина Ким", start: "2026-11-05T09:00:00.000Z" }),
    );
    expect(notice.kind).toBe("ok");
    expect(notice.title).toContain("Ирина Ким");
    expect(notice.title).toContain("12:00");
  });

  test("отказ функции показывает её ошибки", async () => {
    const notice = await book(
      "u",
      request,
      reply(422, { errors: ["консультации проходят по будним дням"] }),
    );
    expect(notice.kind).toBe("warn");
    expect(notice.details).toEqual(["консультации проходят по будним дням"]);
  });

  test("отказ календаря это ошибка", async () => {
    const notice = await book("u", request, reply(502, { errors: ["не удалось создать запись"] }));
    expect(notice.kind).toBe("error");
  });
});

test("время формы получает московский пояс", () => {
  expect(toMoscowTime("2026-11-05T12:00")).toBe("2026-11-05T12:00:00+03:00");
});
