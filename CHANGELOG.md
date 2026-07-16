# Changelog

Todas as mudanças relevantes deste projeto serão registradas aqui. O formato segue Keep a Changelog e as versões seguem Semantic Versioning.

## [Unreleased]

### Planned

- Definir o backend e a estratégia de autenticação antes de habilitar compartilhamento entre usuários.

## [0.5.0] - 2026-07-16

### Added

- Validação automática de estrutura, referências locais, JSON, CSP, IDs e declarações JavaScript duplicadas.
- Testes de regressão para sanitização de URLs e para as regras da ferramenta de qualidade.
- Build reproduzivel de `dist/` com manifesto SHA-256.
- Servidor local sem dependencias externas.
- Workflow de qualidade e deploy para GitHub Pages.
- Documentação de arquitetura, updates, segurança e decisões técnicas.

### Changed

- O repositório raiz passa a ser a fonte de verdade; `dist/` é somente um artefato gerado.
- Removidas declarações antigas que duplicavam renderizadores ativos.
- Normalizada a codificação UTF-8 dos comentários do CSS.

### Security

- A política de segurança e a sanitização de URLs agora fazem parte do gate automático de publicação.
