# Matriz de casos de teste

Legenda: F = funcional, A = API, R = regressão · + positivo, − negativo · ✅ Pass · ❌ Fail · ⏸ Não executado · 📝 Descrito (regressão simulada)

Ambiente local (Docker) com seed padrão

## Autenticação JWT

| ID            | Título                                                      | Requisito | Tipo | Resultado | Bug                          |
| ------------- | ----------------------------------------------------------- | --------- | ---- | --------- | ---------------------------- |
| CT-JWT-FUN-01 | Login válido pela tela (conta verificada do seed)           | RF-02     | F+   | ✅        |                              |
| CT-JWT-FUN-03 | Cadastro pela tela recebe e-mail com código de verificação  | RF-01     | F+   | ❌        | BUG-JWT-01                   |
| CT-JWT-API-18 | Cadastro pela API: conta nasce PENDENTE e sem tokens        | RF-01     | A−   | ❌        | BUG-JWT-01                   |
| CT-JWT-API-19 | Login de conta não verificada é recusado                    | RF-02     | A−   | ❌        | BUG-JWT-02                   |
| CT-JWT-API-07 | Admin cria temporada (201) e lista usuários sem senha       | RF-03     | A+   | ✅        |                              |
| CT-JWT-API-06 | Member e trainee em endpoints de gestão → 403 (10 requests) | RF-03     | A−   | ✅        |                              |
| CT-JWT-API-20 | Senha guardada como hash bcrypt ($2b$10$, 60 caracteres)    | RNF-01    | A+   | ✅        |                              |
| CT-JWT-API-01 | Login com senha errada → 401 "Credenciais inválidas"        | RNF-01    | A−   | ✅        |                              |
| CT-JWT-REG-01 | Regressão após corrigir a verificação de conta              | —         | R    | 📝        | [regressao.md](regressao.md) |

## Check-in por foto

| ID            | Título                                                       | Requisito | Tipo | Resultado | Bug                          |
| ------------- | ------------------------------------------------------------ | --------- | ---- | --------- | ---------------------------- |
| CT-CHK-FUN-01 | Check-in com foto válida pela tela fica Pendente             | RF-04     | F+   | ❌        | BUG-PTS-02                   |
| CT-CHK-API-01 | POST /checkins com foto válida → 201, status PENDING         | RF-05     | A+   | ❌        | BUG-PTS-02                   |
| CT-CHK-API-13 | Segundo check-in no mesmo dia é recusado                     | RF-04     | A−   | ❌        | BUG-CHK-02                   |
| CT-CHK-API-16 | A mesma foto enviada duas vezes é recusada                   | RF-04     | A−   | ❌        | BUG-CHK-02                   |
| CT-CHK-API-17 | Admin aprova check-in → 200, APPROVED                        | RF-05     | A+   | ✅        |                              |
| CT-CHK-API-11 | Member tenta mudar status → 403                              | RF-05     | A−   | ✅        |                              |
| CT-CHK-API-18 | Member abre o próprio check-in → 200                         | RF-06     | A+   | ✅        |                              |
| CT-CHK-API-10 | Member abre check-in de outro usuário → 403/404              | RF-06     | A−   | ❌        | BUG-CHK-01                   |
| CT-CHK-API-19 | Pasta uploads/ vazia depois de um upload com sucesso         | RNF-02    | A+   | ⏸         |                              |
| CT-CHK-API-20 | Pasta uploads/ vazia depois de falha no Cloudinary           | RNF-02    | A−   | ❌        | BUG-CHK-03                   |
| CT-CHK-REG-01 | Regressão após corrigir o acesso a check-in de outro usuário | —         | R    | 📝        | [regressao.md](regressao.md) |

## Pontos e ranking

| ID            | Título                                                         | Requisito | Tipo | Resultado | Bug                          |
| ------------- | -------------------------------------------------------------- | --------- | ---- | --------- | ---------------------------- |
| CT-PTS-FUN-04 | Admin exclui check-in pela tela e o ranking desconta os pontos | RF-08     | F+   | ❌        | BUG-PTS-01                   |
| CT-PTS-API-02 | Saldo só sobe depois da aprovação, no valor da temporada       | RF-07     | A+   | ❌        | BUG-PTS-02                   |
| CT-PTS-API-04 | Check-in rejeitado não soma pontos                             | RF-07     | A−   | ❌        | BUG-PTS-02                   |
| CT-PTS-API-05 | Excluir check-in aprovado desconta os pontos                   | RF-08     | A+   | ❌        | BUG-PTS-01                   |
| CT-PTS-API-13 | Excluir check-in inexistente → 404 e nenhum saldo muda         | RF-08     | A−   | ✅        |                              |
| CT-PTS-API-01 | Ranking em ordem decrescente (desempate por check-ins)         | RF-09     | A+   | ✅        |                              |
| CT-PTS-API-14 | Dois check-ins com menos de 24 h: o segundo é recusado         | RF-09     | A−   | ⏸         |                              |
| CT-PTS-REG-01 | Regressão após corrigir o desconto na exclusão                 | —         | R    | 📝        | [regressao.md](regressao.md) |

## Ad-hoc (criados durante a execução)

| ID              | Título                                       | Requisito | Tipo | Resultado | Bug        |
| --------------- | -------------------------------------------- | --------- | ---- | --------- | ---------- |
| CT-PTS-ADHOC-01 | Check-in em temporada com data final vencida | RF-04     | F−   | ❌        | BUG-PTS-03 |

## Totais

**Planejados 26 · Executados 24 · Pass 10 · Fail 14 · Não executados 2** (mais 3 cenários de regressão descritos)

Não executados:

- **CT-CHK-API-19:** ficou para depois do CT-CHK-API-20.
- **CT-PTS-API-14:** exige dois envios em horários controlados (23h50 e 0h10). O comportamento parecido, de aceitar mais de um check-in no mesmo dia, já aparece no CT-CHK-API-13.
