# plop-generate-component

Генератор компонентов React с архитектурой Feature-Sliced Design (FSD).

## Установка

bash
npm install plop-generate-component

## Использование

1. Создайте файл ( `plopfile.mjs` для ESM) в корне вашего проекта:

javascript
import generateComponent from 'plop-generate-component';
export default function (plop) {
generateComponent(plop);
}

2. Добавьте скрипт в package.json:
   {
   "scripts": {
   "generate": "plop component"
   }
   }

3. Запустите генератор:
   bash
   npm run generate

## Возможности

- Генерация компонентов для всех слоев FSD (features, entities, pages, shared, widgets)
- Поддержка React.memo
- Автоматическое создание необходимых файлов (model, schema, types и т.д.)
- Опциональное создание byID компонентов для pages

## Лицензия

MIT
