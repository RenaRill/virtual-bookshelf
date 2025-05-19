# 📚 Virtual Shelf | Клиент-серверное приложение для создания виртуальной книжной полки пользователей

**Virtual Shelf** — это веб-приложение для ведения коллекции книг *с доступом к общему каталогу*, которое позволяет сохранять и учитывать даже те книги, которые отсутствуют в популярных библиотеках.

**Деплой:** [virtual-shelf.up.railway.app](https://virtual-shelf.up.railway.app)

---
## Структура проекта

```
virtual-shelf/
├── server/                   # Backend
│   ├── gateway/                  # Spring Cloud Gateway (роутинг, JWT, CORS)
│   ├── user-service/             # Микросервис пользователей
│   ├── book-service/             # Микросервис книг
│   └── shelf-service/            # Микросервис полок
├── client/                   # Frontend
├── docker-compose.yml        # Запуск всех сервисов локально
└── README.md                 # Описание проекта
```
---
## Технологии

- Backend: **Java + Spring Boot (Web, Security, Data JPA)**  
- Gateway: **Spring Cloud Gateway + JWT**  
- Frontend: **React.js + Axios + Bootstrap + Yup + Formik**
- Auth: **JWT (Bearer Token)**  
- DB: **PostgreSQL**
- DevOps: **Docker + Railway (бесплатный тариф)**
---
## Функционал

- Регистрация и авторизация
- Добавление книг в общий каталог
- Просмотр, добавление, изменение и удаление своих полок
- Просмотр публичных полок пользователей
- Фильтрация книг и публичных полок  
