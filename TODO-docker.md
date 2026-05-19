# TODO-docker

## План контейнеризации (local dev stack)

- [ ] 1. Создать `.dockerignore` для Node/.NET артефактов и кэшей.
- [ ] 2. Создать `Dockerfile.frontend` для Next.js dev.
- [ ] 3. Создать `Dockerfile.backend` для ASP.NET Core dev.
- [ ] 4. Создать `docker-compose.yml` с сервисами `frontend`, `backend`, `postgres`.
- [ ] 5. Настроить network (общая для всех сервисов) и проброс портов.
- [ ] 6. Настроить env:
  - [ ] `NEXT_PUBLIC_API_URL=http://backend:5193`
  - [ ] `ConnectionStrings__Postgres=Host=postgres;Port=5432;Database=...;Username=...;Password=...`
- [ ] 7. Сохранить hot reload через volume mounts (и не ломать `node_modules`).
- [ ] 8. Проверить запуск: `docker compose up --build`.
- [ ] 9. Проверить:
  - [ ] Swagger `http://localhost:5193/swagger`
  - [ ] GET `/api/transactions`
  - [ ] фронт fetch запросы
  - [ ] EF Core подключение к Postgres


