# Regressão e reteste

O desafio pede um cenário por área: simular que um bug reportado foi corrigido e dizer quais testes repetir para garantir que a correção não quebrou outras partes do sistema. Cada cenário escolhe os testes em três círculos:

- **Reteste:** o caso que falhou, para confirmar a correção.
- **Vizinhança:** casos que passam pelo mesmo código ou pela mesma tabela.
- **Fluxo principal:** o smoke da área, para garantir que o caminho feliz continua de pé.

O ponto de partida foi a "Análise" de cada bug report e uma busca no código do NaSalinha (`Ctrl + Shift + F`) por quem mais usa os trechos que a correção muda.

---

## Regressão: Autenticação (CT-JWT-REG-01)

**Bug corrigido (simulado):** BUG-JWT-01, cadastro cria conta já ativa, sem código de verificação.

**Correção provável:**

- `backend/prisma/schema.prisma` ganha um status de verificação e um código de verificação na tabela `users`.
- `auth.controller.js`, função `register`: cria a conta como PENDENTE, gera o código, envia por e-mail (`config/email.js`) e não devolve tokens.
- Uma nova rota de verificação ativa a conta.
- `login` recusa contas pendentes.
- A tela `Register.js` pede o código.

**O que a correção toca:**

- tabela `users` e a migração;
- `register` e `login` do `auth.controller.js`;
- o middleware `authenticate` (`middlewares/auth.js`), que também barra usuário inativo em **todas** as rotas;
- `config/email.js`;
- o `seed.js`, porque os usuários do seed precisam continuar verificados;
- as telas de cadastro e login.

Caso o erro de **cadastro sem verificação** seja corrigido, os testes abaixo devem ser realizados:

| Círculo         | Teste                         | Por quê                                                                                                                             |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Reteste         | CT-JWT-FUN-03                 | Confirmar o e-mail com código e a tela para digitar o código.                                                                       |
| Reteste         | CT-JWT-API-18                 | Confirmar que a conta nasce PENDENTE e sem tokens.                                                                                  |
| Reteste         | CT-JWT-API-19                 | O login de conta pendente agora deve ser recusado com a mensagem do RF-02.                                                          |
| Vizinhança      | CT-JWT-FUN-01                 | O login mudou: contas verificadas (seed) precisam continuar entrando.                                                               |
| Vizinhança      | CT-JWT-API-01                 | A checagem nova no login não pode trocar o 401 de senha errada por outro erro.                                                      |
| Vizinhança      | CT-JWT-API-20                 | O `register` foi reescrito: a senha continua sendo salva com hash bcrypt.                                                           |
| Vizinhança      | CT-JWT-API-06 e CT-JWT-API-07 | O `authenticate` lê o mesmo campo de status; tokens de admin, member e trainee precisam continuar valendo com as permissões certas. |
| Fluxo principal | CT-CHK-FUN-01                 | Smoke: um member do seed loga e faz check-in (toda rota de check-in passa pelo `authenticate`).                                     |
| Fluxo principal | CT-PTS-API-01                 | Smoke: o ranking continua respondendo para usuário logado.                                                                          |

---

## Regressão: Check-in (CT-CHK-REG-01)

**Bug corrigido (simulado):** BUG-CHK-01, membro consegue ver o check-in de outro usuário pelo ID.

**Correção provável:**

- `checkin.controller.js`, função `getById`: devolve 403 ou 404 quando `checkIn.userId` é diferente de `req.user.id` e o usuário não é ADMIN.
- Em `checkin.routes.js`, a listagem geral `GET /checkins` passa a respeitar o dono, ou a ser só de admin.

**O que a correção toca:**

- `getById` e `getAll`, e as rotas `GET /checkins` e `GET /checkins/:id`;
- o Dashboard, porque a "Atividade Recente" usa `GET /checkins` (em `Dashboard.js`) e o admin usa a mesma lista para excluir check-ins.

Caso o erro de **acesso ao check-in de outro usuário** seja corrigido, os testes abaixo devem ser realizados:

| Círculo         | Teste         | Por quê                                                                                                             |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Reteste         | CT-CHK-API-10 | Confirmar 403/404 ao abrir o check-in da Maria com o token do Lucas.                                                |
| Vizinhança      | CT-CHK-API-18 | O dono continua vendo o próprio check-in (200).                                                                     |
| Vizinhança      | CT-CHK-API-17 | O admin continua abrindo e aprovando check-ins de qualquer usuário.                                                 |
| Vizinhança      | CT-CHK-API-11 | A regra nova não pode afrouxar o 403 de member mudando status.                                                      |
| Vizinhança      | CT-PTS-FUN-04 | O admin usa a lista do Dashboard (`GET /checkins`) para achar e excluir check-ins.                                  |
| Fluxo principal | CT-CHK-FUN-01 | Smoke: o member faz check-in e o vê na "Atividade Recente", que depende de `GET /checkins`.                         |
| Fluxo principal | CT-PTS-API-01 | Smoke: o ranking continua listando todos os usuários (é um dado público, não pode ser cortado pelo filtro de dono). |
| Fluxo principal | CT-JWT-API-06 | Smoke de autorização: as outras rotas de gestão continuam devolvendo 403 para member e trainee.                     |

---

## Regressão: Pontos e ranking (CT-PTS-REG-01)

**Bug corrigido (simulado):** BUG-PTS-01, excluir check-in não desconta os pontos do usuário no ranking.

**Correção provável:** em `checkin.controller.js`, na função `delete`, se o check-in estava APPROVED, decrementar `totalPoints` (pelos `points` do check-in) e `checkInsCount` na tabela `points`, na mesma transação do `prisma.checkIn.delete`.

**O que a correção toca:**

- a tabela `points`, que também é escrita pelo `create` do check-in e lida pelo `ranking.controller.js` (`getGeneral`, `getBySeason`);
- o botão de lixeira do Dashboard;
- a tela de Ranking.

Caso o erro de **exclusão sem desconto de pontos** seja corrigido, os testes abaixo devem ser realizados:

| Círculo         | Teste                    | Por quê                                                                                   |
| --------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| Reteste         | CT-PTS-API-05            | Confirmar o desconto pela API.                                                            |
| Reteste         | CT-PTS-FUN-04            | Confirmar o desconto pela tela; rodar a consulta Q3 depois, que deve voltar `(0 rows)`.   |
| Vizinhança      | CT-PTS-API-13            | Excluir check-in inexistente continua 404 e não mexe em nenhum saldo.                     |
| Vizinhança      | CT-PTS-API-05 (variação) | Excluir o **único** check-in de um usuário: o total vai a 0, nunca negativo.              |
| Vizinhança      | CT-PTS-API-04            | Excluir um check-in **rejeitado** não pode descontar pontos que ele nunca deu.            |
| Vizinhança      | CT-PTS-API-02            | A soma de pontos na aprovação (mesma tabela `points`) continua certa.                     |
| Vizinhança      | CT-PTS-API-01            | Depois do desconto, a ordem do ranking e o desempate por check-ins continuam corretos.    |
| Fluxo principal | CT-CHK-FUN-01            | Smoke: o check-in pela tela continua criando o registro e somando os pontos.              |
| Fluxo principal | CT-CHK-API-11            | Smoke de autorização das rotas de check-in: member continua sem poder alterar ou remover. |

---

## Suíte de API pelo terminal

Para repetir toda a parte de API de uma vez depois de qualquer correção, sempre com o banco voltando ao seed antes:

```bash
docker compose exec backend npx prisma@5.22.0 db seed
newman run collection/NaSalinha-QA.postman_collection.json \
  -e collection/NaSalinha-local.postman_environment.json \
  --working-dir collection/arquivos \
  --reporters cli,json --reporter-json-export docs/evidencias/regressao-newman.json
```

A pasta `00 Setup` roda primeiro e gera os tokens. O CT-CHK-API-20 (Cloudinary quebrado) e o CT-PTS-API-14 (horário controlado) são manuais.

## Reteste

Como não houve nova versão do NaSalinha, o reteste refaz cada caso que falhou, com os mesmos dados, e registra o resultado em um comentário na issue do bug, por exemplo: "Reteste em <data>: continua reproduzindo (sem correção disponível)". O resultado de cada reteste está no comentário da issue correspondente.
