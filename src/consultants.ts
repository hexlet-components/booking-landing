// Тот же список, что в consultants.json проекта «Автоматизация записи на консультацию».
// Функция студента выбирает консультанта по нему, поэтому имена и темы совпадают.
export const topics = {
  frontend: "Фронтенд",
  backend: "Бэкенд",
  devops: "DevOps",
  data: "Данные",
  testing: "Тестирование",
  career: "Карьера",
} as const;

export type Topic = keyof typeof topics;

export const consultants: { name: string; avatar: string; topics: Topic[] }[] = [
  { name: "Анна Смирнова", avatar: "anna-smirnova", topics: ["frontend", "career"] },
  { name: "Олег Петров", avatar: "oleg-petrov", topics: ["backend", "devops"] },
  { name: "Ирина Ким", avatar: "irina-kim", topics: ["frontend", "testing"] },
  { name: "Дмитрий Соколов", avatar: "dmitry-sokolov", topics: ["data", "backend"] },
  { name: "Елена Волкова", avatar: "elena-volkova", topics: ["career"] },
];
