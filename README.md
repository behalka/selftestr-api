# selftestr-api

## Jak rozchodit aktuální verzi databáze:

- migrace:
  - `./node_modules/.bin/sequelize db:migrate:undo:all`
  - `./node_modules/.bin/sequelize db:migrate`
- seedování dat:
  - `./node_modules/.bin/sequelize db:seed:all`

Je důležitý aby během seedování všechny soubory běžely dohromady (do paměti se ukládají vytvořený UUID indexy a dělají se z nich asociace).

## TestInstance endpoint:

``` js
http://localhost:3000/tests/:test_instance_id
```

Vrátí naseedovanej test včetně otázek a odpovědí. `test_instance_id` si dohledat v databázi. Aktuální parametry už zůstanou, budou jen přibývat nový.
