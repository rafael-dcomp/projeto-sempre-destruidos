# Quick Start - CI/CD Audit Tool

## 🚀 Como Usar a Ferramenta de Auditoria

### Execução Básica

```bash
# Via npm script (recomendado)
npm run audit:ci

# Ou diretamente
node scripts/audit/ci-audit.js rafael-dcomp projeto-sempre-destruidos
```

### Com GitHub Token (evita rate limits)

```bash
export GITHUB_TOKEN=seu_token_aqui
npm run audit:ci
```

## 📊 Ver Resultados

```bash
# Relatório Markdown (formatado)
cat docs/audit/audit-report.md

# Relatório JSON (estruturado)
cat docs/audit/audit-report.json
```

## ⚙️ Pipeline CI/CD

O pipeline executa automaticamente em:
- Push para `main`, `develop`, ou `copilot/**`
- Pull Requests para `main` ou `develop`

### Visualizar no GitHub

1. Vá para a aba **Actions** no repositório
2. Veja os workflows em execução
3. Clique em um workflow para detalhes

## 🧪 Testar Build Localmente

```bash
# Build completo
npm run build

# Verificar saída
ls -la dist/
```

## 📚 Documentação Completa

- **Guia Completo**: [`docs/CICD-GUIDE.md`](CICD-GUIDE.md)
- **Resumo Executivo**: [`docs/EXECUTIVE-SUMMARY.md`](EXECUTIVE-SUMMARY.md)
- **Documentação da Auditoria**: [`docs/audit/README.md`](audit/README.md)

---

**Para iniciar o jogo**: Veja [`QUICKSTART.md`](QUICKSTART.md)
