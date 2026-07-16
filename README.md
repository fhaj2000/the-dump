# DUMP

DUMP é uma aplicação estática para organizar coleções em workspaces especializados. O navegador persiste os registros em `localStorage` e os arquivos enviados em IndexedDB; não existe backend nesta versão.

## Requisitos

- Node.js 24 ou superior para validação, testes, servidor local e build.
- Git para acompanhar as mudanças da fonte.

O projeto não possui dependências de terceiros. Não é necessário executar `npm install`.

## Comandos

```powershell
npm run dev
npm run verify
npm run preview
```

- `npm run dev` abre a fonte em `http://localhost:8080`.
- `npm run verify` valida HTML, CSS, JavaScript, JSON e segurança; roda os testes; e gera um novo `dist/` com manifesto de integridade.
- `npm run preview` serve exatamente o artefato gerado em `dist/`.

## Estrutura

```text
index.html                 entrada única da aplicação
assets/css/style.css       interface visual
assets/js/script.js        comportamento e persistência local
assets/images/             imagens públicas
audio/                     áudios públicos e sons da interface
metadata/                  versão e configurações futuras
scripts/                   validação, build e servidor local
tests/                     testes automatizados
docs/                      arquitetura e processo de updates
dist/                      artefato gerado; nunca editar manualmente
archive/                   snapshots locais fora do controle de versão
```

Os caminhos `audio/...` são um contrato de compatibilidade: registros salvos podem depender deles e a pasta deve permanecer na raiz pública.

Leia [docs/UPDATES.md](docs/UPDATES.md) antes de publicar uma alteração e [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) antes de mudar persistência, URLs ou a estrutura pública.
