# Staff Platform

Frontend система управления сетью магазинов: организации, магазины, сотрудники, расписание смен и профиль пользователя.

## Стек

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- daisyUI
- date-fns

## Установка

```sh
npm install
```

## Запуск

```sh
npm run dev
```

## Сборка

```sh
npm run build
```

Команда запускает проверку типов и production-сборку.

## Проверки и форматирование

```sh
npm run type-check
npm run lint
npm run format
npm run format:check
npm run check
```

- `type-check` - проверяет TypeScript и Vue-типы через `vue-tsc`.
- `lint` - запускает ESLint.
- `format` - форматирует проект через Prettier.
- `format:check` - проверяет форматирование без изменения файлов.
- `check` - запускает основные проверки перед коммитом.

Для форматирования одного файла можно использовать:

```sh
npx prettier src/pages/profile/ui/ProfileView.vue --write
```