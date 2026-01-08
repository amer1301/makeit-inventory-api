# MakeIT Inventory API

REST API för lagerhantering (produkter, kategorier, lagerjustering, användare) byggt med NestJS + Prisma.

## Teknik
- NestJS
- Prisma ORM
- SQLite (lokalt)
- JWT Auth + roller (ADMIN/STAFF)
- class-validator DTO-validering

## Start
1. npm install
2. Skapa .env (se .env.example)
3. npx prisma migrate dev
4. npm run start:dev

## Starta API
- npm run start:dev
- körs normalt på: http://localhost:3000

## Auth
- Register: `POST /auth/register`
- Exempel body:
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin",
  "role": "ADMIN"
}
```
## Login
- Register: `POST /auth/register`
- Exempel body:
```json
{
  "accessToken": "JWT_TOKEN_HERE"
}
```
Använd token i requests:
Authorization: Bearer <token>

