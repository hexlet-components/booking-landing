# booking-landing

[![CI](https://github.com/hexlet-components/booking-landing/actions/workflows/main.yml/badge.svg)](https://github.com/hexlet-components/booking-landing/actions/workflows/main.yml)
[![Check](https://github.com/hexlet-components/booking-landing/actions/workflows/check.yml/badge.svg)](https://github.com/hexlet-components/booking-landing/actions/workflows/check.yml)

Лендинг вымышленной онлайн-школы «Кодовая школа» для проекта «Автоматизация записи на консультацию» программы «ИИ-автоматизатор» Хекслета. Сайт открыт на <https://hexlet-components.github.io/booking-landing/>.

Студент пишет serverless-функцию в Яндекс Облаке, которая принимает заявку, выбирает консультанта и ставит событие в Яндекс Календарь. На последнем шаге проекта он подключает свою функцию к этому сайту и записывается через форму. Тёмная полоса сверху страницы это стенд: в неё вписывается адрес функции, а кнопка «Проверить» шлёт пустую заявку и показывает, отвечает ли функция и настроен ли CORS. Пустая заявка в календаре ничего не создаёт. Адрес хранится в `localStorage` браузера.

Список консультантов и тем повторяет `consultants.json` из репозитория проекта. Функция студента выбирает консультанта по этому файлу, поэтому при его правке меняется и [src/consultants.ts](src/consultants.ts). Аватары сгенерированы [DiceBear Notionists](https://www.dicebear.com/styles/notionists/) (автор Zoish, лицензия CC0 1.0) по слагу имени и лежат в [public/avatars](public/avatars).

## Запуск

```sh
mise run setup
mise run dev
```

Сборка `mise run build` кладёт сайт в `dist/`. Пуш в main выкладывает его на GitHub Pages. `make <задача>` вызывает ту же задачу mise.

## Проверки

`mise run check` гоняет тот же набор, что CI: разметку, опечатки, ссылки, workflows, oxfmt, oxlint, tsc, knip и osv-scanner. Тесты разбора ответов функции запускает `mise run test`.

---

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://hexlet.io/?utm_source=github&utm_medium=link&utm_campaign=booking-landing)

This repository is created and maintained by the team and the community of Hexlet, an educational project. [Read more about Hexlet](https://hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=booking-landing).
