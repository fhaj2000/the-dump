# Security policy

## Escopo atual

DUMP é uma aplicação estática. Os dados ficam no navegador em `localStorage` e IndexedDB. Não há contas, servidor, sincronização ou controle de acesso nesta versão.

## Regras de segurança

- Nunca adicionar tokens, senhas ou credenciais ao repositório.
- Toda URL controlada por dados deve passar por `safeUrl(...)` antes de entrar em `href`, `src` ou APIs de navegacao.
- Conteudo textual inserido em HTML deve passar por `esc(...)`.
- Não adicionar manipuladores inline (`onclick`, `onerror` e similares).
- Alterações na Content Security Policy exigem `npm run verify` e teste no navegador.
- O compartilhamento entre usuários só pode ser habilitado depois de existir backend com autenticação, autorização e validação no servidor.

## Verificação

Execute `npm run verify` antes de cada commit destinado à publicação. A automação do GitHub repete o mesmo gate antes do deploy.
