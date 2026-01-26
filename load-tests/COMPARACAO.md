# Guia de Comparação de Testes Artillery

## 🎯 Qual Teste Usar Quando?

### Tabela de Decisão Rápida

| Situação | Teste Recomendado | Comando |
|----------|-------------------|---------|
| Primeira vez testando | `http-light-load.yml` | `npm run load-test:light` |
| Validar antes de deploy | `http-medium-load.yml` | `npm run load-test:medium` |
| Preparar para Black Friday | `http-heavy-load.yml` | `npm run load-test:heavy` |
| Encontrar ponto de quebra | `stress-test.yml` | `npm run load-test:stress` |
| Testar gameplay multiplayer | `websocket-test.yml` | `npm run load-test:websocket` |
| Criar teste personalizado | `config-template.yml` | Copiar e editar |

---

## 📊 Comparação Detalhada dos Testes

### 1. http-light-load.yml

**Objetivo:** Validação básica de funcionalidade sob carga leve

| Característica | Valor |
|----------------|-------|
| **Carga inicial** | 10 usuários/seg |
| **Carga máxima** | 20 usuários/seg |
| **Duração total** | ~2 minutos |
| **Total de usuários** | ~1,800 |
| **Padrão de carga** | Aquecimento → Constante → Desaceleração |

**Cenários testados:**
- ✅ Registro de usuário (30%)
- ✅ Login (40%)
- ✅ Ranking (30%)

**Quando usar:**
- ✅ Primeiro teste do dia
- ✅ Após mudanças no código
- ✅ Validação rápida
- ✅ Ambiente de desenvolvimento

**Não usar para:**
- ❌ Validar capacidade de produção
- ❌ Encontrar limites do sistema

---

### 2. http-medium-load.yml

**Objetivo:** Simular carga moderada de produção

| Característica | Valor |
|----------------|-------|
| **Carga inicial** | 20 usuários/seg |
| **Carga máxima** | 50 usuários/seg |
| **Duração total** | ~4 minutos |
| **Total de usuários** | ~7,500 |
| **Padrão de carga** | Aquecimento → Ramp-up → Sustentado → Desaceleração |

**Cenários testados:**
- ✅ Registro (25%)
- ✅ Login (40%)
- ✅ Ranking (20%)
- ✅ Sequência completa (15%)

**Quando usar:**
- ✅ Validação pré-deploy
- ✅ Teste de aceitação
- ✅ Simular uso normal de produção
- ✅ Baseline de performance

**Não usar para:**
- ❌ Encontrar ponto de quebra
- ❌ Simular picos extremos

---

### 3. http-heavy-load.yml

**Objetivo:** Testar limites do sistema sob carga pesada

| Característica | Valor |
|----------------|-------|
| **Carga inicial** | 30 usuários/seg |
| **Carga máxima** | 150 usuários/seg |
| **Duração total** | ~3.5 minutos |
| **Total de usuários** | ~16,500 |
| **Padrão de carga** | Aquecimento → Ramp-up agressivo → Sustentado → Pico → Desaceleração |

**Cenários testados:**
- ✅ Registro (20%)
- ✅ Login (45%)
- ✅ Ranking (25%)
- ✅ Sequência completa (10%)

**Quando usar:**
- ✅ Preparação para eventos especiais
- ✅ Black Friday / Cyber Monday
- ✅ Lançamento de produto
- ✅ Validar escalabilidade

**Não usar para:**
- ❌ Testes diários
- ❌ Ambiente de desenvolvimento

---

### 4. stress-test.yml

**Objetivo:** Levar o sistema além da capacidade normal para encontrar ponto de falha

| Característica | Valor |
|----------------|-------|
| **Carga inicial** | 50 usuários/seg |
| **Carga máxima** | 300 usuários/seg |
| **Duração total** | ~3 minutos |
| **Total de usuários** | ~25,500 |
| **Padrão de carga** | Aquecimento → Ramp-up rápido → Extremo → Spike → Recuperação → Normal |

**Cenários testados:**
- ✅ Registro massivo (25%)
- ✅ Login intenso (40%)
- ✅ Ranking sob estresse (35%)

**Quando usar:**
- ✅ Encontrar ponto de quebra
- ✅ Validar recuperação após sobrecarga
- ✅ Planejar capacidade futura
- ✅ Testar tolerância a falhas

**Não usar para:**
- ❌ Validação regular
- ❌ Ambiente de produção sem autorização
- ❌ Testes automatizados em CI/CD

---

### 5. websocket-test.yml

**Objetivo:** Testar conexões WebSocket e gameplay em tempo real

| Característica | Valor |
|----------------|-------|
| **Carga inicial** | 2 conexões/seg |
| **Carga máxima** | 5 conexões/seg |
| **Duração total** | ~3 minutos |
| **Total de conexões** | ~600 |
| **Padrão de carga** | Conexões iniciais → Ramp-up → Sustentado |

**Cenários testados:**
- ✅ Conexão WebSocket
- ✅ Envio de inputs de jogador (movimento)
- ✅ Simulação de gameplay

**Quando usar:**
- ✅ Testar Socket.IO
- ✅ Validar gameplay multiplayer
- ✅ Testar broadcast de eventos
- ✅ Validar sincronização em tempo real

**Não usar para:**
- ❌ Testar endpoints HTTP
- ❌ Validar autenticação

---

## 🔄 Fluxo Recomendado de Testes

### Para Desenvolvimento Diário:

```
1. http-light-load.yml
   ↓ (se passou)
2. Continuar desenvolvendo
```

### Para Release/Deploy:

```
1. http-light-load.yml
   ↓ (se passou)
2. http-medium-load.yml
   ↓ (se passou)
3. websocket-test.yml (se aplicável)
   ↓ (se passou)
4. ✅ DEPLOY!
```

### Para Planejamento de Capacidade:

```
1. http-medium-load.yml (baseline)
   ↓
2. http-heavy-load.yml (capacidade máxima)
   ↓
3. stress-test.yml (ponto de quebra)
   ↓
4. 📊 Análise e decisão sobre infraestrutura
```

### Para Validação Completa:

```
1. http-light-load.yml (warm-up)
   ↓
2. http-medium-load.yml (produção normal)
   ↓
3. websocket-test.yml (real-time)
   ↓
4. http-heavy-load.yml (picos)
   ↓
5. stress-test.yml (limites)
   ↓
6. http-medium-load.yml (recuperação)
```

---

## 📈 Resultados Esperados

### http-light-load.yml

```
✅ SUCESSO se:
- p95 < 500ms
- Errors = 0%
- 100% requisições completadas

⚠️ ALERTA se:
- p95 entre 500-1000ms
- Errors < 1%

🚨 FALHA se:
- p95 > 1000ms
- Errors > 1%
```

### http-medium-load.yml

```
✅ SUCESSO se:
- p95 < 1000ms
- Errors < 1%
- > 95% requisições completadas

⚠️ ALERTA se:
- p95 entre 1000-2000ms
- Errors entre 1-3%

🚨 FALHA se:
- p95 > 2000ms
- Errors > 3%
```

### http-heavy-load.yml

```
✅ SUCESSO se:
- p95 < 2000ms
- Errors < 5%
- > 90% requisições completadas

⚠️ ALERTA se:
- p95 entre 2000-3000ms
- Errors entre 5-10%

🚨 FALHA se:
- p95 > 3000ms
- Errors > 10%
```

### stress-test.yml

```
✅ SUCESSO se:
- Sistema continua respondendo
- Errors < 20%
- Sistema se recupera após teste

⚠️ ALERTA se:
- p99 > 10000ms
- Errors entre 20-50%
- Recuperação lenta

🚨 FALHA se:
- Sistema para de responder
- Errors > 50%
- Sistema não se recupera
```

### websocket-test.yml

```
✅ SUCESSO se:
- Todas as conexões estabelecidas
- Latência < 100ms
- Sem desconexões inesperadas

⚠️ ALERTA se:
- Latência entre 100-300ms
- < 5% desconexões

🚨 FALHA se:
- Latência > 300ms
- > 5% desconexões
- Conexões falhando
```

---

## 🎨 Customização por Cenário

### Cenário: E-commerce - Black Friday

**Base:** `http-heavy-load.yml`

**Modificações:**
```yaml
phases:
  - duration: 60
    arrivalRate: 50
    rampTo: 200
    name: "Spike Black Friday"
  
  - duration: 300
    arrivalRate: 200
    name: "Sustentado Black Friday"
```

---

### Cenário: API de Integração

**Base:** `http-medium-load.yml`

**Modificações:**
```yaml
phases:
  - duration: 3600    # 1 hora
    arrivalRate: 30
    name: "Soak test API"

scenarios:
  - name: "Endpoint Crítico"
    weight: 80        # 80% para endpoint principal
  - name: "Endpoints Secundários"
    weight: 20
```

---

### Cenário: Jogo Multiplayer

**Base:** `websocket-test.yml`

**Modificações:**
```yaml
phases:
  - duration: 120
    arrivalRate: 1
    rampTo: 10        # 10 novos jogadores/seg
    name: "Jogadores entrando"
  
  - duration: 300
    arrivalRate: 10
    name: "Gameplay ativo"
```

---

## 💡 Dicas de Uso

### Dica 1: Sempre começar pelo mais leve
```bash
# ✅ CERTO
npm run load-test:light      # Primeiro
npm run load-test:medium     # Depois
npm run load-test:heavy      # Por último

# ❌ ERRADO
npm run load-test:stress     # NÃO começar com estresse
```

### Dica 2: Monitorar recursos durante testes
```bash
# Terminal 1: Executar teste
npm run load-test:heavy

# Terminal 2: Monitorar Docker
docker stats

# Terminal 3: Monitorar logs
docker-compose logs -f app
```

### Dica 3: Aguardar entre testes
```bash
npm run load-test:medium
sleep 60                     # Aguardar 1 minuto
npm run load-test:heavy
```

### Dica 4: Gerar relatórios para comparação
```bash
# Antes da otimização
npx artillery run --output antes.json load-tests/http-medium-load.yml

# Após otimização
npx artillery run --output depois.json load-tests/http-medium-load.yml

# Comparar visualmente os relatórios
npx artillery report antes.json
npx artillery report depois.json
```

---

## 📚 Documentação Relacionada

- [Guia Rápido](./GUIA-RAPIDO.md)
- [README Completo](./README.md)
- [Exemplos Visuais](./EXEMPLOS-VISUAIS.md)
- [Guia de Relatórios](./RELATORIOS.md)
- [Template de Configuração](./config-template.yml)

---

**Desenvolvido para o projeto Distributed Multiplayer Football**  
*Universidade Federal de Sergipe - Sistemas Distribuídos - 2026*
