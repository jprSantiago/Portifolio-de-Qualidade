Portifólio de Qualidade: NaSalinha

Auditoria de QA do NaSalinha, sistema de check-in gamificado da Comp Júnior, feita como desafio da trilha de Quality Assurance 2026.2.

![Casos](https://img.shields.io/badge/casos-26-blue)
![Executados](https://img.shields.io/badge/executados-24-blue)
![Bugs](https://img.shields.io/badge/bugs-8-red)

## Resultado em números

| Casos planejados | Executados | Pass | Fail | Bugs (Crít./Maior/Menor) |
| ---------------- | ---------- | ---- | ---- | ------------------------ |
| 26               | 24         | 10   | 14   | 1 / 7 / 0                |

**Recomendação:** não está pronto para produção (falha de controle de acesso no check-in e pontos inconsistentes no ranking).

- Relatório completo: [docs/relatorio-de-testes.md](docs/relatorio-de-testes.md)
- Vídeo de demonstração:

## Escopo

As três áreas Core: **Autenticação JWT**, **Check-in por foto** e **Sistema de pontos/ranking**.

## Tipos de teste e estratégia

- **Funcional:** pela interface (Chrome), validando o comportamento na tela.
- **API:** Postman, validando status codes, corpo das respostas e efeitos no banco.
- **Regressão:** um cenário simulado por área em [docs/regressao.md](docs/regressao.md), com reteste, vizinhança e fluxo principal. A suíte de API pode ser reexecutada com o Newman.
- **Técnicas:** partição de equivalência, valor limite, tabela de decisão, transição de estado e suposição de erro.
- **Abordagem caixa-cinza:** além da tela e da API, conferimos o banco com psql, a pasta `uploads/` do container e o código para a análise dos bugs.

## Ferramentas

Docker e Docker Compose · Postman e Newman · GitHub Issues e Projects · Chrome DevTools · PostgreSQL (psql) · Mailtrap · Cloudinary · OBS Studio

## Como rodar o NaSalinha

O código do NaSalinha está neste repositório (pastas `backend/` e `frontend/`).

1. `git clone https://github.com/jprSantiago/Portifolio-de-Qualidade.git` e `cd Portifolio-de-Qualidade`
2. `cp backend/.env.example backend/.env` e preencher Cloudinary (`CLOUDINARY_*`) e Mailtrap (`EMAIL_USER`, `EMAIL_PASSWORD`).
3. `docker compose up --build -d`
4. `docker compose exec backend npx prisma@5.22.0 migrate dev --name init`
5. `docker compose exec backend npx prisma@5.22.0 db seed`
6. Abrir http://localhost:3000 (admin@nasalinha.com / senha123).

### Armadilhas encontradas

- **Mailtrap:** o host é `sandbox.smtp.mailtrap.io` e a variável lida pelo código é `EMAIL_PASSWORD`. O README do backend diz `EMAIL_PASS`.
- **Prisma:** use `npx prisma@5.22.0`. Sem a versão fixa, o `npx` baixa uma versão nova, incompatível com o projeto.
- **Rate limit:** a API aceita só 100 requests a cada 15 minutos. Para rodar a coleção inteira, suba `RATE_LIMIT_MAX_REQUESTS=2000` no `backend/.env`.
- **Mudanças no `.env`:** o backend lê `backend/.env` (`env_file` do compose), não um `.env` na raiz. Depois de alterar, use `docker compose up -d --force-recreate backend`, porque o `restart` não relê o arquivo.
- **Seed recria os usuários com IDs novos:** depois de cada seed, rode de novo a pasta `00 Setup` da coleção.
- **Postman Web não serve:** ele não lê arquivos locais (upload de foto) nem acessa `localhost`. Use o Postman Desktop.
- **Environment:** selecione o environment `NaSalinha local` no canto superior direito e também no Runner. Sem ele, a URL vira `http://auth/login`.
- **Tokens expiram:** um `401 "Token inválido ou expirado"` no meio dos testes se resolve rodando a `00 Setup` de novo.
- **psql:** consultas copiadas do PDF podem trazer quebras de linha que travam o prompt (`-#`). Aperte `Ctrl+C` e cole a consulta numa linha só.

## Como rodar os testes de API

- **Postman:**
  1. Importe `collection/NaSalinha-QA.postman_collection.json` e `collection/NaSalinha-local.postman_environment.json`.
  2. Em _Settings → General → Working directory_, aponte para a pasta `collection/arquivos/`, que tem as fotos `real.jpg` e `outra.jpg`.
  3. Rode a pasta `00 Setup` primeiro e depois as pastas 01, 02 e 03 no Runner.
  4. Deixe desmarcados o `CT-CHK-API-20` (manual, exige quebrar o Cloudinary) e o `CT-PTS-API-14a/b` (dependem de horário).
- **Terminal:**

  ```bash
  newman run collection/NaSalinha-QA.postman_collection.json -e collection/NaSalinha-local.postman_environment.json --working-dir collection/arquivos
  ```

## Documentação

- Bugs: [Issues com a label bug](../../issues?q=label%3Abug)
- Kanban e casos de teste: [Github](https://github.com/users/jprSantiago/projects/2/views/1)
- Matriz de casos: [docs/casos-de-teste.md](docs/casos-de-teste.md)
- Regressão: [docs/regressao.md](docs/regressao.md)
- Relatório: [docs/relatorio-de-testes.md](docs/relatorio-de-testes.md)

## Estrutura

```
Portifolio-de-Qualidade/
├── .github/ISSUE_TEMPLATE/   # templates de bug report e caso de teste
├── backend/                  # API do NaSalinha (Node + Prisma)
├── frontend/                 # interface do NaSalinha (React)
├── collection/               # coleção e environment do Postman
│   └── arquivos/             # fotos usadas nos testes de upload
├── docs/
│   ├── casos-de-teste.md     # matriz de casos
│   ├── regressao.md          # cenários de regressão por área
│   ├── relatorio-de-testes.md
│   └── evidencias/           # prints, GIFs e relatório do Newman
├── docker-compose.yml
└── README.md
```
