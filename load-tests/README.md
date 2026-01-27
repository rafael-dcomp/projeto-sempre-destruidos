# Guia de Testes de Carga com Artillery

## 📋 Índice
- [O que é Artillery?](#o-que-é-artillery)
- [Arquivos de Teste Disponíveis](#arquivos-de-teste-disponíveis)
- [Como Executar os Testes](#como-executar-os-testes)
- [Parâmetros Configuráveis](#parâmetros-configuráveis)
- [Interpretando os Resultados](#interpretando-os-resultados)
- [Criando Cenários Personalizados](#criando-cenários-personalizados)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 O que é Artillery?

Artillery é uma ferramenta moderna de teste de carga e performance para aplicações web. Permite simular milhares de usuários virtuais acessando seu sistema simultaneamente para verificar como ele se comporta sob diferentes níveis de carga.

**Por que usar Artillery?**
- ✅ Fácil de configurar e usar
- ✅ Suporta HTTP, WebSocket, Socket.IO
- ✅ Relatórios detalhados de performance
- ✅ Configuração baseada em YAML (legível e flexível)
- ✅ Gratuito e open-source

---

## 📁 Arquivos de Teste Disponíveis

Este projeto inclui 5 cenários de teste pré-configurados:

### 1. **http-light-load.yml** - Carga Leve
- **Objetivo:** Teste básico com carga baixa
- **Usuários virtuais:** 10-20 por segundo
- **Duração:** ~2 minutos
- **Quando usar:** Validação inicial, desenvolvimento, testes rápidos

### 2. **http-medium-load.yml** - Carga Média
- **Objetivo:** Simula uso moderado do sistema
- **Usuários virtuais:** 20-50 por segundo
- **Duração:** ~4 minutos
- **Quando usar:** Testes de aceitação, validação de capacidade normal

### 3. **http-heavy-load.yml** - Carga Pesada
- **Objetivo:** Testa os limites do sistema
- **Usuários virtuais:** 30-150 por segundo
- **Duração:** ~3.5 minutos
- **Quando usar:** Validar capacidade máxima, preparação para picos de tráfego

### 4. **stress-test.yml** - Teste de Estresse
- **Objetivo:** Leva o sistema ao ponto de falha
- **Usuários virtuais:** 50-300 por segundo
- **Duração:** ~3 minutos
- **Quando usar:** Identificar limites absolutos, testar recuperação após sobrecarga

### 5. **websocket-test.yml** - Teste WebSocket
- **Objetivo:** Testa conexões Socket.IO em tempo real
- **Conexões simultâneas:** 2-5 por segundo
- **Duração:** ~3 minutos
- **Quando usar:** Validar gameplay multiplayer, comunicação em tempo real

---

## 🚀 Como Executar os Testes

### Pré-requisitos
1. Certifique-se de que o servidor está rodando:
   ```bash
   # Usando Docker
   docker-compose up -d
   
   # OU executando localmente
   npm run dev
   ```

2. Verifique se o Artillery está instalado:
   ```bash
   npm install
   ```

### Comandos Básicos

#### Executar teste de carga leve:
```bash
npm run load-test:light
```

#### Executar teste de carga média:
```bash
npm run load-test:medium
```

#### Executar teste de carga pesada:
```bash
npm run load-test:heavy
```

#### Executar teste de estresse:
```bash
npm run load-test:stress
```

#### Executar teste WebSocket:
```bash
npm run load-test:websocket
```

### Execução Manual (com Artillery CLI)

```bash
# Sintaxe básica
npx artillery run load-tests/<nome-do-arquivo>.yml

# Exemplos:
npx artillery run load-tests/http-light-load.yml
npx artillery run load-tests/stress-test.yml

# Com relatório HTML
npx artillery run --output report.json load-tests/http-medium-load.yml
npx artillery report report.json
```

---

## ⚙️ Parâmetros Configuráveis

### 1. **Target (Servidor Alvo)**

Define qual servidor será testado:

```yaml
config:
  target: 'http://localhost:3000'  # Servidor local
  # target: 'https://meu-servidor.com'  # Servidor remoto
```

**Como modificar:**
- Para testes locais: `http://localhost:3000`
- Para servidor de staging: `https://staging.meuapp.com`
- Para produção: `https://producao.meuapp.com`

---

### 2. **Phases (Fases do Teste)**

As fases definem como a carga é aplicada ao longo do tempo:

```yaml
phases:
  - duration: 60        # Duração da fase em segundos
    arrivalRate: 10     # Novos usuários virtuais por segundo
    name: "Fase 1"      # Nome descritivo da fase
```

#### Parâmetros de Fase:

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `duration` | Tempo que a fase durará (segundos) | `60` = 1 minuto |
| `arrivalRate` | Quantos usuários virtuais chegam por segundo | `10` = 10 usuários/seg |
| `rampTo` | Aumentar gradualmente até este valor | `rampTo: 50` |
| `name` | Nome descritivo da fase | `"Aquecimento"` |

#### Exemplo de Ramp-Up:
```yaml
phases:
  # Começar com 10 usuários/seg e aumentar para 50 durante 60 segundos
  - duration: 60
    arrivalRate: 10
    rampTo: 50
    name: "Ramp-up gradual"
```

---

### 3. **Scenarios (Cenários de Teste)**

Cenários definem o que os usuários virtuais farão:

```yaml
scenarios:
  - name: "Login de Usuário"
    weight: 40  # 40% dos usuários executarão este cenário
    flow:
      - post:
          url: "/api/auth/login"
          json:
            username: "{{ testUser }}"
            password: "{{ testPassword }}"
```

#### Parâmetros de Cenário:

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `name` | Nome do cenário | `"Registro de Usuário"` |
| `weight` | Porcentagem de usuários que executam este cenário | `30` = 30% |
| `flow` | Sequência de ações a executar | Lista de requisições |

---

### 4. **Variables (Variáveis)**

Variáveis permitem parametrizar seus testes:

```yaml
config:
  variables:
    testUser: "meu_usuario"
    testPassword: "MinhaSenh@123"
    apiKey: "abc123xyz"
```

**Funções disponíveis nas variáveis:**
- `{{ $randomString() }}` - Gera string aleatória
- `{{ $randomNumber(1, 100) }}` - Gera número entre 1 e 100
- `{{ $randomBoolean() }}` - Gera true ou false

---

### 5. **Timeout**

Define quanto tempo aguardar por uma resposta antes de considerar erro:

```yaml
config:
  timeout: 30  # Timeout de 30 segundos
```

---

### 6. **Expect (Validações)**

Valida se as respostas estão corretas:

```yaml
flow:
  - get:
      url: "/api/auth/ranking"
      expect:
        - statusCode: 200           # Espera código HTTP 200
        - contentType: json         # Espera resposta JSON
        - hasProperty: "data"       # Espera propriedade "data"
```

---

## 📊 Interpretando os Resultados

Após executar um teste, Artillery mostra estatísticas detalhadas:

```
Summary report @ 22:30:45 2026-01-26
--------------------------------
  Scenarios launched:  1000      # Total de cenários iniciados
  Scenarios completed: 995       # Total de cenários completados
  Requests completed:  2985      # Total de requisições completadas
  
  Response time (msec):
    min: 12                       # Tempo mínimo de resposta
    max: 342                      # Tempo máximo de resposta
    median: 45                    # Tempo mediano (50% abaixo, 50% acima)
    p95: 125                      # 95% das respostas abaixo deste tempo
    p99: 198                      # 99% das respostas abaixo deste tempo
  
  Scenario duration (msec):
    min: 250                      # Duração mínima do cenário
    max: 1520                     # Duração máxima do cenário
    median: 680                   # Duração mediana
    p95: 1240                     # 95% dos cenários completados neste tempo
    p99: 1480                     # 99% dos cenários completados neste tempo
  
  Codes:
    200: 2500                     # 2500 respostas com código 200 (sucesso)
    401: 350                      # 350 respostas com código 401 (não autorizado)
    500: 5                        # 5 respostas com código 500 (erro servidor)
  
  Errors:
    ETIMEDOUT: 5                  # 5 requisições com timeout
```

### O que observar:

#### ✅ Sinais de SUCESSO:
- **p95 < 1000ms**: 95% das respostas em menos de 1 segundo
- **Codes 200 > 95%**: Maioria das requisições bem-sucedidas
- **Errors = 0**: Sem erros de conexão
- **Scenarios completed ≈ Scenarios launched**: Todos os cenários completados

#### ⚠️ Sinais de ALERTA:
- **p95 > 2000ms**: Sistema lento sob carga
- **Codes 500 > 1%**: Erros no servidor
- **Errors > 5%**: Problemas de conexão ou timeouts
- **Scenarios completed < 90% launched**: Muitos cenários não completados

#### 🚨 Sinais de PROBLEMA:
- **p95 > 5000ms**: Sistema muito lento
- **Codes 500 > 10%**: Sistema instável
- **Errors > 20%**: Sistema sobrecarregado
- **Scenarios completed < 50% launched**: Sistema próximo ao colapso

---

## 🛠️ Criando Cenários Personalizados

### Exemplo 1: Teste de Autenticação Personalizado

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 120
      arrivalRate: 25
      name: "Teste customizado"
  variables:
    username: "meu_usuario"
    password: "minha_senha"

scenarios:
  - name: "Fluxo Completo de Autenticação"
    weight: 100
    flow:
      # 1. Fazer login
      - post:
          url: "/api/auth/login"
          json:
            username: "{{ username }}"
            password: "{{ password }}"
          capture:
            - json: "$.token"
              as: "authToken"
          expect:
            - statusCode: 200
      
      # 2. Aguardar 2 segundos
      - think: 2
      
      # 3. Consultar ranking
      - get:
          url: "/api/auth/ranking"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
```

### Exemplo 2: Teste de Spike (Pico Repentino)

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    # Carga normal
    - duration: 60
      arrivalRate: 10
      name: "Carga normal"
    
    # SPIKE! Pico repentino
    - duration: 10
      arrivalRate: 200
      name: "SPIKE - Pico repentino"
    
    # Volta ao normal
    - duration: 60
      arrivalRate: 10
      name: "Recuperação"

scenarios:
  - name: "Teste de Ranking"
    weight: 100
    flow:
      - get:
          url: "/api/auth/ranking"
```

### Exemplo 3: Teste de Soak (Longa Duração)

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    # Carga constante por 1 hora
    - duration: 3600
      arrivalRate: 20
      name: "Soak Test - 1 hora"

scenarios:
  - name: "Uso Contínuo"
    weight: 100
    flow:
      - get:
          url: "/api/auth/ranking"
      - think: 5
      - post:
          url: "/api/auth/login"
          json:
            username: "user_{{ $randomNumber(1, 100) }}"
            password: "Test123!@#"
```

---

## 📈 Exemplos de Uso

### Cenário 1: Validação Antes de Deploy

**Objetivo:** Garantir que o sistema aguenta a carga esperada

```bash
# 1. Executar teste de carga média
npm run load-test:medium

# 2. Verificar se p95 < 1000ms e errors < 1%

# 3. Se passou, executar teste pesado
npm run load-test:heavy

# 4. Se passou, fazer deploy com confiança!
```

### Cenário 2: Encontrar Limite do Sistema

**Objetivo:** Descobrir quantos usuários simultâneos o sistema suporta

```bash
# 1. Começar com carga leve
npm run load-test:light
# Resultado: OK (p95 = 200ms)

# 2. Aumentar para carga média
npm run load-test:medium
# Resultado: OK (p95 = 450ms)

# 3. Aumentar para carga pesada
npm run load-test:heavy
# Resultado: ALERTA (p95 = 1800ms, alguns erros)

# 4. Testar estresse
npm run load-test:stress
# Resultado: FALHA (p95 = 8000ms, muitos erros)

# CONCLUSÃO: Sistema suporta bem até ~100 usuários/segundo
```

### Cenário 3: Teste de Recuperação

**Objetivo:** Ver se o sistema se recupera após sobrecarga

```bash
# 1. Executar teste de estresse
npm run load-test:stress

# 2. Aguardar 5 minutos

# 3. Executar teste de carga média
npm run load-test:medium

# 4. Verificar se voltou ao normal (p95 < 1000ms)
```

---

## 💡 Dicas e Boas Práticas

### 1. Sempre aqueça o sistema
```yaml
phases:
  # Boa prática: começar devagar
  - duration: 30
    arrivalRate: 5
    name: "Aquecimento"
  
  # Depois aumentar gradualmente
  - duration: 60
    arrivalRate: 5
    rampTo: 50
    name: "Ramp-up"
```

### 2. Use think time
Simula tempo que usuários reais levam entre ações:
```yaml
flow:
  - get:
      url: "/api/auth/ranking"
  - think: 3  # Aguardar 3 segundos (usuário lendo dados)
  - post:
      url: "/api/auth/login"
```

### 3. Capture dados para usar depois
```yaml
flow:
  - post:
      url: "/api/auth/login"
      capture:
        - json: "$.token"
          as: "authToken"  # Salvar token
  
  - get:
      url: "/api/perfil"
      headers:
        Authorization: "Bearer {{ authToken }}"  # Usar token
```

### 4. Monitore o servidor durante testes
```bash
# Em outro terminal, monitore recursos:
docker stats

# Ou se local:
htop
```

### 5. Teste em ambiente de staging primeiro
Nunca execute testes de estresse em produção sem autorização!

---

## 🔧 Troubleshooting

### Problema: "ECONNREFUSED"
**Causa:** Servidor não está rodando
**Solução:** Inicie o servidor antes de executar testes

### Problema: "ETIMEDOUT"
**Causa:** Servidor muito lento ou sobrecarregado
**Solução:** Reduzir carga ou aumentar timeout

### Problema: Muitos erros 500
**Causa:** Servidor com problemas sob carga
**Solução:** Investigar logs do servidor, otimizar código

### Problema: Artillery não encontra arquivo
**Causa:** Caminho incorreto
**Solução:** Executar a partir da raiz do projeto

---

## 📚 Recursos Adicionais

- [Documentação Oficial Artillery](https://www.artillery.io/docs)
- [Guia de Métricas de Performance](https://www.artillery.io/docs/guides/guides/metrics)
- [Artillery no GitHub](https://github.com/artilleryio/artillery)

---

## 🎓 Glossário

- **VU (Virtual User)**: Usuário virtual simulado pelo Artillery
- **RPS (Requests Per Second)**: Requisições por segundo
- **Latency**: Tempo de resposta
- **p95/p99**: Percentil 95/99 - tempo que 95%/99% das requisições ficam abaixo
- **Throughput**: Taxa de transferência (requisições processadas)
- **Ramp-up**: Aumento gradual de carga
- **Spike**: Pico repentino de carga
- **Soak Test**: Teste de longa duração com carga constante
- **Stress Test**: Teste além da capacidade normal

---

**Desenvolvido para o projeto Distributed Multiplayer Football**  
*Universidade Federal de Sergipe - Sistemas Distribuídos - 2026*
