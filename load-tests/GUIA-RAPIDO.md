# Artillery Load Testing - Guia Rápido

## 🚀 Execução Rápida

### Comandos Disponíveis:

```bash
# Teste de Carga Leve (recomendado para começar)
npm run load-test:light

# Teste de Carga Média
npm run load-test:medium

# Teste de Carga Pesada
npm run load-test:heavy

# Teste de Estresse (leva sistema ao limite)
npm run load-test:stress

# Teste de WebSocket (Socket.IO)
npm run load-test:websocket

# Executar todos os testes HTTP em sequência
npm run load-test:all
```

## 📝 Antes de Executar

1. **Inicie o servidor:**
   ```bash
   # Com Docker
   docker-compose up -d
   
   # OU localmente
   npm run dev
   ```

2. **Verifique se está rodando:**
   ```bash
   curl http://localhost:3000/
   # Ou abra http://localhost:3000 no navegador
   ```

## 🎯 Principais Parâmetros para Modificar

### 1. Servidor Alvo
Arquivo: Qualquer `.yml` em `load-tests/`
```yaml
config:
  target: 'http://localhost:3000'  # <-- MUDAR AQUI
```

### 2. Intensidade da Carga
```yaml
phases:
  - duration: 60          # DURAÇÃO: quantos segundos
    arrivalRate: 10       # CARGA: usuários virtuais por segundo
    rampTo: 50            # RAMP-UP: aumentar até este valor (opcional)
```

### 3. Cenários (O que testar)
```yaml
scenarios:
  - name: "Nome do Teste"
    weight: 40            # PESO: % de usuários que farão isto
    flow:                 # FLUXO: sequência de ações
```

## 📊 Lendo os Resultados

```
Summary report:
  Response time (msec):
    p95: 125              # ✅ BOM se < 1000ms
    p99: 198              # ✅ BOM se < 2000ms
  
  Codes:
    200: 2500             # ✅ BOM se > 95%
    500: 5                # ⚠️ RUIM se > 1%
  
  Errors: 0               # ✅ BOM se = 0
```

## 🎨 Exemplos de Customização

### Exemplo 1: Testar com 100 usuários/segundo por 5 minutos
Edite `load-tests/http-heavy-load.yml`:
```yaml
phases:
  - duration: 300         # 5 minutos = 300 segundos
    arrivalRate: 100      # 100 usuários por segundo
    name: "Teste customizado"
```

### Exemplo 2: Testar servidor remoto
Edite qualquer arquivo `.yml`:
```yaml
config:
  target: 'https://meu-servidor.com.br'
```

### Exemplo 3: Criar novo teste
1. Copie um arquivo existente:
   ```bash
   cp load-tests/http-light-load.yml load-tests/meu-teste.yml
   ```

2. Edite `meu-teste.yml` conforme necessário

3. Execute:
   ```bash
   npx artillery run load-tests/meu-teste.yml
   ```

## 📈 Fluxo Recomendado

```
1. Começar com LIGHT    → Validar que sistema funciona
2. Aumentar para MEDIUM → Testar carga normal
3. Testar HEAVY         → Validar capacidade máxima
4. Executar STRESS      → Encontrar ponto de falha
```

## 🔥 Cenários Práticos

### Preparação para Black Friday
```yaml
phases:
  - duration: 300        # 5 minutos
    arrivalRate: 200     # Muitos usuários simultâneos
```

### Teste Noturno Prolongado
```yaml
phases:
  - duration: 7200       # 2 horas
    arrivalRate: 30      # Carga moderada constante
```

### Simulação de Pico (Spike Test)
```yaml
phases:
  - duration: 60
    arrivalRate: 10      # Normal
  - duration: 30
    arrivalRate: 500     # SPIKE!
  - duration: 60
    arrivalRate: 10      # Volta ao normal
```

## 🛠️ Troubleshooting

| Problema | Solução |
|----------|---------|
| "ECONNREFUSED" | Servidor não está rodando - execute `npm run dev` |
| Muitos timeouts | Reduza `arrivalRate` ou aumente `timeout` no config |
| Erros 500 | Servidor sobrecarregado - investigue logs |
| Artillery não encontra arquivo | Execute do diretório raiz do projeto |

## 📚 Documentação Completa

Para guia detalhado, veja: [load-tests/README.md](./README.md)

---

**Dúvidas?** Consulte a [documentação completa](./README.md) ou [Artillery Docs](https://www.artillery.io/docs)
