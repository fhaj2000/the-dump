# Fluxo de updates

## Alteração normal

1. Atualize a branch principal e crie uma branch curta, como `feat/audio-queue` ou `fix/import-json`.
2. Edite somente a fonte. Não altere `dist/` diretamente.
3. Rode `npm run dev` e verifique o fluxo afetado no navegador.
4. Rode `npm run verify`. O comando deve terminar sem erros.
5. Registre a mudança em `CHANGELOG.md` na seção `Unreleased`.
6. Crie um commit pequeno com um assunto objetivo, por exemplo `fix: preserve uploaded audio on import`.
7. Abra um pull request. A automação repete o gate e, na branch principal, publica o `dist/` aprovado.

## Nova versão

1. Escolha a versão com Semantic Versioning:
   - patch: correção compatível;
   - minor: recurso novo compatível;
   - major: quebra de dados, URLs ou comportamento público.
2. Atualize a mesma versão em `package.json` e `metadata/release.json`.
3. Mova as notas de `Unreleased` para uma secao datada em `CHANGELOG.md`.
4. Rode `npm run verify` e confira `dist/build-manifest.json`.
5. Crie uma tag Git `vX.Y.Z` somente depois de o commit estar aprovado.

## Checklist de regressão manual

- Entrar na aplicação e alternar categorias e workspaces.
- Criar, editar, duplicar, mover e excluir uma entry.
- Exportar e importar JSON.
- Testar upload, reprodução e remoção de áudio.
- Recarregar a página e confirmar persistência.
- Verificar console do navegador sem erros ou alertas de CSP.
- Testar pelo menos uma largura de desktop e uma largura mobile.

## Mudanças de dados

Qualquer alteração em formato persistido precisa conter:

- versão anterior e nova;
- função de migração idempotente;
- comportamento quando dados estiverem incompletos;
- teste com um export antigo;
- instrução de rollback no changelog.
