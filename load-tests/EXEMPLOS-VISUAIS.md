# Exemplos Visuais de Configuração Artillery

Este guia mostra exemplos visuais de como diferentes configurações afetam os testes.

## 📊 Visualizando as Fases de Teste

### 1. Carga Constante

```yaml
phases:
  - duration: 120
    arrivalRate: 20
```

```
Usuários/seg
    ^
 20 |■■■■■■■■■■■■■■■■■■■■■■■■■■
    |
  0 |________________________
    0    30    60    90   120 (segundos)
```

**Quando usar:** Validar capacidade sustentada, testes de estabilidade

---

### 2. Ramp-Up (Aumento Gradual)

```yaml
phases:
  - duration: 120
    arrivalRate: 5
    rampTo: 50
```

```
Usuários/seg
    ^
 50 |                    ▓▓▓▓
    |                ▓▓▓▓
    |            ▓▓▓▓
    |        ▓▓▓▓
    |    ▓▓▓▓
  5 |▓▓▓▓
    |________________________
    0    30    60    90   120 (segundos)
```

**Quando usar:** Encontrar ponto de saturação gradualmente, preparar sistema

---

### 3. Spike Test (Pico Repentino)

```yaml
phases:
  - duration: 60
    arrivalRate: 10
  - duration: 20
    arrivalRate: 100    # SPIKE!
  - duration: 60
    arrivalRate: 10
```

```
Usuários/seg
    ^
100 |       ▓▓▓▓
    |       ▓▓▓▓
    |       ▓▓▓▓
 10 |■■■■■■■▓▓▓▓■■■■■■■
    |________________________
    0    60  80  100    140 (segundos)
```

**Quando usar:** Simular Black Friday, lançamento de produto, eventos especiais

---

### 4. Step Load (Carga em Degraus)

```yaml
phases:
  - duration: 60
    arrivalRate: 10
  - duration: 60
    arrivalRate: 30
  - duration: 60
    arrivalRate: 50
```

```
Usuários/seg
    ^
 50 |                    ■■■■■■■■
    |
 30 |          ■■■■■■■■
    |
 10 |■■■■■■■■
    |________________________________
    0         60        120        180 (segundos)
```

**Quando usar:** Identificar em qual degrau o sistema começa a degradar

---

### 5. Soak Test (Teste Prolongado)

```yaml
phases:
  - duration: 7200    # 2 horas
    arrivalRate: 25
```

```
Usuários/seg
    ^
 25 |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    |
  0 |________________________________________
    0   30min   60min   90min   120min (tempo)
```

**Quando usar:** Detectar memory leaks, degradação ao longo do tempo

---

## 🎯 Cenários de Peso (Weight)

```yaml
scenarios:
  - name: "Login"
    weight: 50      # 50% dos usuários
  - name: "Ranking"
    weight: 30      # 30% dos usuários
  - name: "Registro"
    weight: 20      # 20% dos usuários
```

**Visualização:**

```
De cada 100 usuários virtuais:
┌──────────────────────────────────────────────────┐
│ Login     (50 usuários)   ████████████████████   │
│ Ranking   (30 usuários)   ████████████           │
│ Registro  (20 usuários)   ████████               │
└──────────────────────────────────────────────────┘
```

---

## 📈 Exemplos de Diferentes Intensidades

### Carga Leve (Development)

```yaml
phases:
  - duration: 60
    arrivalRate: 5
```
- **Total esperado:** ~300 requisições
- **Usuários simultâneos:** ~10-20
- **Uso:** Desenvolvimento, smoke test

### Carga Média (Production Normal)

```yaml
phases:
  - duration: 120
    arrivalRate: 30
```
- **Total esperado:** ~3,600 requisições
- **Usuários simultâneos:** ~100-200
- **Uso:** Validação de capacidade normal

### Carga Pesada (Peak Hours)

```yaml
phases:
  - duration: 180
    arrivalRate: 100
```
- **Total esperado:** ~18,000 requisições
- **Usuários simultâneos:** ~500-1000
- **Uso:** Preparação para picos de tráfego

### Stress Test (Breaking Point)

```yaml
phases:
  - duration: 60
    arrivalRate: 300
```
- **Total esperado:** ~18,000 requisições em 1 minuto
- **Usuários simultâneos:** ~2000-3000
- **Uso:** Encontrar limite absoluto do sistema

---

## 🎨 Padrões de Teste Comuns

### Padrão 1: Aquecimento → Carga → Desaceleração

```yaml
phases:
  - duration: 30
    arrivalRate: 5
    name: "Aquecimento"
  
  - duration: 120
    arrivalRate: 50
    name: "Carga Principal"
  
  - duration: 30
    arrivalRate: 5
    name: "Desaceleração"
```

```
Usuários/seg
    ^
 50 |    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    |  ▓▓                  ▓▓
  5 |▓▓                      ▓▓
    |________________________
    0   30  60  90  120 150  180
```

---

### Padrão 2: Escalada Progressiva

```yaml
phases:
  - duration: 60
    arrivalRate: 10
    rampTo: 30
  
  - duration: 60
    arrivalRate: 30
    rampTo: 60
  
  - duration: 60
    arrivalRate: 60
    rampTo: 100
```

```
Usuários/seg
    ^
100 |                      ▓▓▓
    |                  ▓▓▓▓
 60 |              ▓▓▓▓
    |          ▓▓▓▓
 30 |      ▓▓▓▓
    |  ▓▓▓▓
 10 |▓▓
    |________________________
    0    60    120    180
```

---

### Padrão 3: Ondas (Waves)

```yaml
phases:
  - duration: 30
    arrivalRate: 10
    rampTo: 50
  - duration: 30
    arrivalRate: 50
    rampTo: 10
  - duration: 30
    arrivalRate: 10
    rampTo: 50
  - duration: 30
    arrivalRate: 50
    rampTo: 10
```

```
Usuários/seg
    ^
 50 |  ▓▓▓      ▓▓▓
    | ▓   ▓    ▓   ▓
    |▓     ▓  ▓     ▓
 10 |       ▓▓       ▓▓
    |________________________
    0   30  60  90  120
```

**Quando usar:** Simular padrões de uso variável ao longo do dia

---

## 💡 Calculando Carga Total

### Fórmula:
```
Total de requisições ≈ arrivalRate × duration × (requisições por cenário)
```

### Exemplo:

```yaml
config:
  phases:
    - duration: 120      # 120 segundos
      arrivalRate: 20    # 20 usuários/seg

scenarios:
  - name: "Login"
    weight: 100
    flow:
      - post: ...        # 1 requisição
      - get: ...         # 1 requisição
      # Total: 2 requisições por cenário
```

**Cálculo:**
```
Usuários virtuais criados = 120 seg × 20 usuários/seg = 2,400 usuários
Requisições por usuário = 2
Total de requisições ≈ 2,400 × 2 = 4,800 requisições
```

---

## 🎯 Escolhendo a Configuração Certa

| Objetivo | Duration | arrivalRate | Padrão |
|----------|----------|-------------|--------|
| Smoke Test | 30-60s | 1-5 | Constante |
| Load Test | 120-300s | 10-50 | Ramp-up |
| Stress Test | 60-180s | 100-500 | Ramp-up agressivo |
| Spike Test | 10-30s pico | 200-1000 | Spike |
| Soak Test | 3600s+ | 20-50 | Constante |
| Capacity Test | 300-600s | Variável | Step load |

---

## 📊 Métricas Esperadas por Carga

### Carga Leve (5-20 req/s)
```
p50: 50-100ms
p95: 200-500ms
p99: 500-1000ms
Errors: 0%
```

### Carga Média (20-50 req/s)
```
p50: 100-300ms
p95: 500-1500ms
p99: 1000-3000ms
Errors: < 1%
```

### Carga Pesada (50-150 req/s)
```
p50: 300-800ms
p95: 1500-3000ms
p99: 3000-6000ms
Errors: < 5%
```

### Stress (150+ req/s)
```
p50: 800ms+
p95: 3000ms+
p99: 6000ms+
Errors: 5-20%+ (esperado)
```

---

**Documentação Completa:** [README.md](./README.md)
