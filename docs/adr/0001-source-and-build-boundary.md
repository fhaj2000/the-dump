# ADR 0001: separar fonte e artefato de publicação

- Status: aceito
- Data: 2026-07-16

## Contexto

O projeto mantinha uma cópia publicável em `dist/` com histórico Git próprio, enquanto a fonte na raiz não tinha um repositório válido nem um processo reproduzível de build. Isso permitia divergência entre fonte e site publicado.

## Decisão

A raiz é a única fonte de verdade e recebe o histórico Git. `dist/` é gerado por uma lista explícita de caminhos públicos, validado por hashes e ignorado pelo repositório raiz. O build preserva temporariamente um `.git` antigo dentro de `dist/`, caso exista, mas nenhum arquivo de produção depende dele.

## Consequências

- Toda mudança passa pelo mesmo gate local e de CI.
- Arquivos locais, ferramentas e snapshots não entram no deploy.
- O artefato pode ser apagado e recriado sem perder a fonte.
- O repositório antigo de `dist/` pode ser removido depois que o remoto da raiz estiver configurado.
