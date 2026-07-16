# Arquitetura

## Visão geral

DUMP é um monolito front-end estático, sem etapa de compilação do código da aplicação. `index.html` carrega um stylesheet e um script principal; o build apenas seleciona, verifica e copia os arquivos públicos.

```text
index.html
  -> assets/css/style.css
  -> assets/js/script.js
       -> localStorage: coleções, registros e preferências
       -> IndexedDB: blobs enviados pelo usuario
       -> audio/: caminhos públicos persistentes
```

## Limites

- Fonte de verdade: arquivos versionados na raiz.
- Artefato de publicação: `dist/`, recriado por `npm run build`.
- Dados do usuário: navegador; nunca devem ser incluídos em `dist/`.
- `metadata/`: metadados de versão e configurações futuras; não é banco de dados.
- `archive/`: snapshots locais, ignorados pelo Git e nunca publicados.

## Contratos que não podem quebrar silenciosamente

1. `index.html` continua sendo a única entrada pública.
2. `audio/` continua na raiz para preservar referências salvas.
3. Alterações em chaves de `localStorage`, stores do IndexedDB ou formato dos registros exigem migração explícita e documentada.
4. URLs externas e locais passam por `safeUrl(...)`; texto interpolado em HTML passa por `esc(...)`.
5. `dist/` nunca é editado manualmente.

## Dívida técnica conhecida

`assets/js/script.js` e `assets/css/style.css` ainda são arquivos grandes. A separação futura deve ocorrer por domínio, em pequenas etapas protegidas pelos testes, sem trocar de framework apenas por organização. Prioridade sugerida:

1. persistência e migrações;
2. segurança e assets;
3. renderizadores por tipo de workspace;
4. player de áudio e leitor de livros;
5. estado e inicialização da interface.
