# Portifólio de Qualidade: NaSalinha

Auditoria de QA do NaSalinha, sistema de check-in gamificado da Comp Júnior, feita como desafio da trilha de Quality Assurance 2026.2.

![Casos](https://img.shields.io/badge/casos-<N>-blue)
![Bugs](https://img.shields.io/badge/bugs-<N>-red)

## Resultado em números

| Casos planejados | Executados | Pass | Fail | Bugs (Crít./Maior/Menor) |
| ---------------- | ---------- | ---- | ---- | ------------------------ |
| <N>              | <N>        | <N>  | <N>  | <c> / <m> / <n>          |

Relatório completo: [docs/relatorio-de-testes.md](docs/relatorio-de-testes.md)
Vídeo de demonstração:

## Escopo

As três áreas Core: Autenticação JWT, Check-in por foto e Sistema de pontos/ranking.

## Tipos de teste e estratégia

- **Funcional:** pela interface (Chrome), validando o comportamento na tela.
- **API:** Postman, validando status codes, corpo das respostas e efeitos no banco.
- **Regressão:** cenários simulados por área em [docs/regressao.md](docs/regressao.md), e a suíte de API reexecutada com o Newman.
- **Técnicas:** partição de equivalência, valor limite, tabela de decisão, transição de estado e suposição de erro. Abordagem caixa-cinza (leitura do código).

## Ferramentas

Docker e Docker Compose · Postman e Newman · GitHub Issues e Projects ·
Chrome DevTools · PostgreSQL (psql) · Mailtrap · Cloudinary · OBS Studio

## Como rodar o NaSalinha

1. `git clone https://github.com/Gustavohmmagalhaes/nasalinha-qa-challenge.git`
2. `cp backend/.env.example backend/.env` e preencher Cloudinary e Mailtrap.
   **Atenção:** trocar `EMAIL_HOST` para `sandbox.smtp.mailtrap.io` e usar a
   variável `EMAIL_PASSWORD` (o README do backend diz `EMAIL_PASS`, mas o código lê `EMAIL_PASSWORD`).
3. `docker compose up --build -d`
4. `docker compose exec backend npx prisma@5.22.0 migrate dev --name init`
5. `docker compose exec backend npx prisma@5.22.0 db seed`
6. Abrir http://localhost:3000 (admin@nasalinha.com / senha123).

## Como rodar os testes de API

- Bugs: [Issues com a label bug](../../issues?q=label%3Abug)
- Kanban e casos de teste:
- Matriz de casos: [docs/casos-de-teste.md](docs/casos-de-teste.md)

## Estrutura

nasalinha-qa-portfolio/
├── README.md
├── collection/
│ ├── NaSalinha-QA.postman_collection.json
│ └── NaSalinha-local.postman_environment.json
├── docs/
│ ├── casos-de-teste.md
│ ├── regressao.md
│ ├── relatorio-de-testes.md
│ └── evidencias/
└── .github/ISSUE_TEMPLATE/
├── bug_report.md
└── caso_de_teste.md
