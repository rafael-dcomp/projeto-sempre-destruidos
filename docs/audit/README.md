# CI/CD Maturity Audit Tool

## Visão Geral

Esta ferramenta automatiza a análise de maturidade de CI/CD de repositórios GitHub, conforme especificado na atividade acadêmica de Sistemas Distribuídos.

## Objetivo

Diagnosticar o estado atual de um projeto open source no GitHub, identificando:
- Presença de CI/CD (workflows do GitHub Actions)
- Evidências de automação (builds, testes, checks)
- Riscos do processo manual
- Nível de maturidade atual
- Recomendações de melhoria

## Como Usar

### Executar Análise

```bash
# Análise básica (sem autenticação)
node scripts/audit/ci-audit.js <owner> <repo>

# Análise com token do GitHub (recomendado para evitar rate limits)
node scripts/audit/ci-audit.js <owner> <repo> <github-token>

# Ou usando variável de ambiente
export GITHUB_TOKEN=seu_token_aqui
node scripts/audit/ci-audit.js <owner> <repo>
```

### Exemplo

```bash
node scripts/audit/ci-audit.js rafael-dcomp projeto-sempre-destruidos
```

## Saída Gerada

A ferramenta gera dois arquivos na pasta `docs/audit/`:

1. **audit-report.json** - Relatório completo em formato JSON
2. **audit-report.md** - Relatório formatado em Markdown

## O Que a Ferramenta Analisa

### 1. Informações do Repositório
- Nome, descrição, linguagem
- Estatísticas (stars, forks, issues)

### 2. CI/CD
- ✅ Verifica existência de `.github/workflows/`
- 📄 Lista todos os arquivos de workflow
- 🔍 Analisa o conteúdo dos workflows

### 3. Sistema de Build
- 📦 Detecta `package.json` e scripts disponíveis
- 🧪 Identifica presença de testes configurados

### 4. Pull Requests
- 📊 Conta PRs com e sem checks automáticos
- ⚡ Analisa histórico de automação

### 5. Nível de Maturidade

**Level 1 - Initial (Inicial)**
- ❌ Sem CI/CD automatizado
- ❌ Builds e testes manuais
- ⚠️ Processos ad-hoc

**Level 2 - Basic (Básico)**
- ✅ Pipeline CI básico existe
- ✅ Builds automatizados
- ⚠️ Testes limitados ou ausentes

**Level 3 - Managed (Gerenciado)**
- ✅ CI/CD com testes automatizados
- ✅ Verificações de qualidade de código
- ✅ Processos consistentes

**Level 4 - Optimized (Otimizado)**
- ✅ Deployments automatizados
- ✅ Cobertura de testes abrangente
- ✅ Verificações de performance e segurança
- ✅ Monitoramento e feedback loops

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript (sem dependências externas)
- **GitHub REST API** - Para coletar dados do repositório
- **HTTPS nativo** - Para requisições HTTP

## Vantagens da Automação

### Sem Automação (Antes)
```
Commit → Pull Request → Revisão Manual → Merge → Build Manual → Testes Manuais
```

**Riscos:**
- 🐛 Bugs podem passar despercebidos
- ⏱️ Processo lento e sujeito a erros
- 📚 Dependência de conhecimento individual
- 🚫 Difícil para novos contribuidores

### Com Automação (Depois)
```
Commit → Pull Request → CI Build Automático → Testes Automáticos → Checks → Merge
```

**Benefícios:**
- ✅ Detecção imediata de problemas
- 🚀 Processo rápido e confiável
- 📖 Documentação executável
- 🎓 Fácil onboarding de novos desenvolvedores

## Relatório de Auditoria

O relatório gerado inclui:

### Seções Principais

1. **Repository Overview** - Informações básicas
2. **CI/CD Analysis** - Status de automação
3. **Workflows Found** - Workflows existentes e conteúdo
4. **Build Scripts Available** - Scripts npm disponíveis
5. **Pull Request Analysis** - Histórico de PRs e checks
6. **Identified Risks** - Riscos identificados
7. **Recommendations** - Recomendações de melhoria
8. **Maturity Model** - Descrição dos níveis de maturidade

### Exemplo de Saída

```
============================================================
AUDIT SUMMARY
============================================================
Repository: rafael-dcomp/projeto-sempre-destruidos
Maturity Level: Initial (Level 1)
Has CI/CD: No ❌
Has Tests: No ❌
============================================================
```

## Integração com IA (Opcional)

Para análise mais avançada com interpretação de IA:

```javascript
const { analyzeRepository } = require('./ci-audit.js');

async function analyzeWithAI(owner, repo) {
    const analysis = await analyzeRepository(owner, repo, process.env.GITHUB_TOKEN);
    
    // Enviar para OpenAI, Claude, ou outra IA
    const prompt = `
        Analise este relatório de CI/CD e forneça insights:
        ${JSON.stringify(analysis, null, 2)}
    `;
    
    // Processar com IA...
}
```

## Limitações

- **Rate Limits**: GitHub API tem limite de 60 requisições/hora sem autenticação (5000 com token)
- **Escopo**: Atualmente analisa apenas GitHub Actions (não Travis, CircleCI, etc)
- **Profundidade**: Analisa até 30 PRs e os 10 mais recentes para checks

## Próximos Passos

Após executar a auditoria:

1. ✅ Revisar o relatório gerado
2. 🔧 Implementar workflow de CI/CD (já incluído em `.github/workflows/ci.yml`)
3. 🧪 Adicionar testes ao projeto
4. 📊 Comparar resultados antes/depois da automação
5. 📝 Documentar o impacto no processo de desenvolvimento

## Contribuição

Esta ferramenta foi desenvolvida como parte da atividade acadêmica de Sistemas Distribuídos - UFS 2026.

**Equipe:**
- Vitor Leonardo
- Nicolas Matheus
- João Pedro

## Licença

ISC License - Uso educacional
