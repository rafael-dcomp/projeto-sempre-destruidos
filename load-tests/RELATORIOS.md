# Guia de Geração de Relatórios Artillery

## 📊 Como Gerar Relatórios HTML

Artillery pode gerar relatórios visuais bonitos em HTML com gráficos e estatísticas detalhadas.

### Passo a Passo:

#### 1. Executar teste e salvar resultados em JSON

```bash
# Sintaxe básica
npx artillery run --output <arquivo-saida>.json <arquivo-teste>.yml

# Exemplos:
npx artillery run --output relatorio-light.json load-tests/http-light-load.yml
npx artillery run --output relatorio-medium.json load-tests/http-medium-load.yml
npx artillery run --output relatorio-stress.json load-tests/stress-test.yml
```

#### 2. Gerar relatório HTML a partir do JSON

```bash
npx artillery report <arquivo-json>

# Exemplos:
npx artillery report relatorio-light.json
# Gera: relatorio-light.json.html

npx artillery report relatorio-medium.json
# Gera: relatorio-medium.json.html
```

#### 3. Abrir o relatório no navegador

```bash
# No Linux/Mac
open relatorio-light.json.html

# No Windows
start relatorio-light.json.html

# Ou simplesmente abra o arquivo .html diretamente no navegador
```

---

## 📋 Comandos Completos

### Teste de Carga Leve com Relatório

```bash
# 1. Executar teste
npx artillery run --output report-light.json load-tests/http-light-load.yml

# 2. Gerar HTML
npx artillery report report-light.json

# 3. Abrir no navegador
open report-light.json.html
```

### Teste de Carga Média com Relatório

```bash
npx artillery run --output report-medium.json load-tests/http-medium-load.yml
npx artillery report report-medium.json
open report-medium.json.html
```

### Teste de Estresse com Relatório

```bash
npx artillery run --output report-stress.json load-tests/stress-test.yml
npx artillery report report-stress.json
open report-stress.json.html
```

---

## 📊 O que o Relatório HTML Mostra

O relatório HTML inclui:

### 1. **Gráficos de Linha do Tempo**
- Taxa de requisições ao longo do tempo
- Tempo de resposta (latência)
- Taxa de erros

### 2. **Estatísticas Detalhadas**
- **Request Rate:** Requisições por segundo
- **Response Time:**
  - Mínimo, Máximo, Mediana
  - p95, p99 (percentis)
- **Códigos HTTP:** Distribuição de respostas (200, 400, 500, etc.)
- **Errors:** Tipos de erros encontrados

### 3. **Métricas por Cenário**
- Performance de cada cenário individualmente
- Taxa de sucesso/falha por cenário

### 4. **Gráficos de Distribuição**
- Histograma de tempos de resposta
- Distribuição de códigos de status

---

## 🎯 Scripts NPM para Relatórios

Adicione ao `package.json`:

```json
{
  "scripts": {
    "load-test:light:report": "artillery run --output report-light.json load-tests/http-light-load.yml && artillery report report-light.json",
    "load-test:medium:report": "artillery run --output report-medium.json load-tests/http-medium-load.yml && artillery report report-medium.json",
    "load-test:heavy:report": "artillery run --output report-heavy.json load-tests/http-heavy-load.yml && artillery report report-heavy.json",
    "load-test:stress:report": "artillery run --output report-stress.json load-tests/stress-test.yml && artillery report report-stress.json"
  }
}
```

Depois use:

```bash
npm run load-test:light:report
npm run load-test:medium:report
npm run load-test:heavy:report
npm run load-test:stress:report
```

---

## 📁 Organizando Relatórios

Crie uma pasta para relatórios:

```bash
mkdir -p load-tests/reports

# Execute testes salvando na pasta de reports
npx artillery run --output load-tests/reports/$(date +%Y%m%d-%H%M%S)-light.json load-tests/http-light-load.yml

# Gerar HTML
npx artillery report load-tests/reports/$(date +%Y%m%d-%H%M%S)-light.json
```

---

## 🔍 Comparando Resultados

### Antes e Depois de Otimizações

```bash
# ANTES da otimização
npx artillery run --output reports/antes-otimizacao.json load-tests/http-medium-load.yml
npx artillery report reports/antes-otimizacao.json

# Fazer otimizações no código...

# DEPOIS da otimização
npx artillery run --output reports/depois-otimizacao.json load-tests/http-medium-load.yml
npx artillery report reports/depois-otimizacao.json

# Comparar os dois relatórios HTML lado a lado
```

---

## 💡 Dicas

### 1. Nome Descritivo de Arquivos

```bash
# Incluir data/hora no nome
artillery run --output report-$(date +%Y%m%d-%H%M%S).json load-tests/http-light-load.yml

# Incluir descrição
artillery run --output report-producao-pre-deploy.json load-tests/http-medium-load.yml
```

### 2. Automatizar Múltiplos Testes

Script bash para executar todos os testes e gerar relatórios:

```bash
#!/bin/bash
# Arquivo: run-all-tests.sh

echo "Executando todos os testes de carga..."

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Teste leve
echo "1/4 - Teste de carga leve..."
npx artillery run --output reports/${TIMESTAMP}-light.json load-tests/http-light-load.yml
npx artillery report reports/${TIMESTAMP}-light.json

# Teste médio
echo "2/4 - Teste de carga média..."
npx artillery run --output reports/${TIMESTAMP}-medium.json load-tests/http-medium-load.yml
npx artillery report reports/${TIMESTAMP}-medium.json

# Teste pesado
echo "3/4 - Teste de carga pesada..."
npx artillery run --output reports/${TIMESTAMP}-heavy.json load-tests/http-heavy-load.yml
npx artillery report reports/${TIMESTAMP}-heavy.json

# Teste de estresse
echo "4/4 - Teste de estresse..."
npx artillery run --output reports/${TIMESTAMP}-stress.json load-tests/stress-test.yml
npx artillery report reports/${TIMESTAMP}-stress.json

echo "Todos os testes concluídos! Relatórios em: reports/"
```

Torne executável e rode:

```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

## 🚫 Adicionar ao .gitignore

Evite commitar relatórios de teste:

```
# Artillery Reports
load-tests/reports/
*.json
report-*.json
report-*.json.html
```

---

## 📈 Exemplo de Análise de Relatório

Ao abrir o relatório HTML, verifique:

### ✅ Indicadores de SUCESSO
- **p95 < 1000ms:** Sistema rápido
- **Erros < 1%:** Sistema estável
- **Gráfico de latência estável:** Sem picos
- **200 responses > 95%:** Maioria das requisições OK

### ⚠️ Indicadores de ALERTA
- **p95 entre 1000-2000ms:** Sistema começando a ficar lento
- **Erros entre 1-5%:** Problemas ocasionais
- **Gráfico com picos:** Instabilidade
- **500 responses > 1%:** Erros no servidor

### 🚨 Indicadores de PROBLEMA
- **p95 > 2000ms:** Sistema muito lento
- **Erros > 5%:** Sistema instável
- **Muitos timeouts:** Sistema sobrecarregado
- **500 responses > 5%:** Sistema falhando

---

**Documentação Completa:** [README.md](./README.md)
