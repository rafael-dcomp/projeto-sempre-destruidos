# Troubleshooting - Testes de Carga Artillery

## 🔧 Problemas Comuns e Soluções

### 1. "Error: ECONNREFUSED"

**Sintoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Causa:** O servidor não está rodando

**Solução:**
```bash
# Verificar se o servidor está rodando
curl http://localhost:3000

# Se não estiver, iniciar o servidor
docker-compose up -d

# OU executar localmente
npm run dev

# Aguardar alguns segundos para o servidor iniciar
sleep 5

# Tentar novamente o teste
npm run load-test:light
```

---

### 2. "Error: ETIMEDOUT"

**Sintoma:**
```
ETIMEDOUT: connection timeout
```

**Causa:** Requisições demorando muito ou servidor sobrecarregado

**Solução:**

**Opção 1: Aumentar timeout**
```yaml
# Edite o arquivo .yml
config:
  timeout: 60  # Aumentar de 30 para 60 segundos
```

**Opção 2: Reduzir carga**
```yaml
# Reduzir arrivalRate
phases:
  - duration: 60
    arrivalRate: 5   # Reduzir de 20 para 5
```

**Opção 3: Aguardar entre testes**
```bash
npm run load-test:medium
sleep 120  # Aguardar 2 minutos
npm run load-test:heavy
```

---

### 3. Muitos Erros 500

**Sintoma:**
```
Codes:
  500: 250  (muitos erros 500)
```

**Causa:** Servidor com problemas sob carga

**Solução:**

**1. Verificar logs do servidor:**
```bash
# Se usando Docker
docker-compose logs -f app

# Procurar por erros, stack traces, exceptions
```

**2. Verificar recursos:**
```bash
# Monitorar uso de CPU/RAM
docker stats

# Se recursos estiverem no limite, aumentar limites
```

**3. Verificar banco de dados:**
```bash
# Verificar se PostgreSQL está respondendo
docker-compose exec postgres psql -U postgres -d football_db -c "SELECT 1"

# Verificar se Redis está respondendo
docker-compose exec redis redis-cli ping
```

**4. Reduzir carga do teste:**
```yaml
# Testar com carga menor primeiro
phases:
  - duration: 60
    arrivalRate: 10  # Começar mais leve
```

---

### 4. "Artillery not found" ou "Command not found"

**Sintoma:**
```
bash: artillery: command not found
```

**Causa:** Artillery não instalado ou não no PATH

**Solução:**
```bash
# Reinstalar dependências
npm install

# OU usar npx para executar
npx artillery run load-tests/http-light-load.yml

# Verificar instalação
npx artillery --version
```

---

### 5. "Cannot find module './load-tests/functions.js'"

**Sintoma:**
```
Error: Cannot find module './load-tests/functions.js'
```

**Causa:** Executando comando do diretório errado

**Solução:**
```bash
# Sempre executar da raiz do projeto
cd /caminho/para/projeto-sempre-destruidos

# Depois executar testes
npm run load-test:light

# Verificar que está no diretório correto
pwd
# Deve mostrar: .../projeto-sempre-destruidos
```

---

### 6. Testes muito lentos (p95 > 5000ms)

**Sintoma:**
```
Response time (msec):
  p95: 8500
  p99: 12000
```

**Causa:** Sistema sobrecarregado ou configuração inadequada

**Solução:**

**1. Verificar se sistema está sobrecarregado:**
```bash
docker stats
# Observar uso de CPU e RAM
```

**2. Aumentar recursos (se usando Docker):**
```yaml
# docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2.0'    # Aumentar CPUs
          memory: 4G     # Aumentar RAM
```

**3. Otimizar código:**
- Adicionar cache
- Otimizar queries de banco
- Adicionar índices no PostgreSQL

**4. Testar com carga menor:**
```bash
npm run load-test:light  # Em vez de heavy
```

---

### 7. WebSocket testes falhando

**Sintoma:**
```
WebSocket connection failed
```

**Causa:** Socket.IO não configurado corretamente ou servidor não suporta WebSocket

**Solução:**

**1. Verificar configuração Socket.IO:**
```bash
# Testar conexão manualmente no navegador
# Abrir console do navegador e executar:
# const socket = io('http://localhost:3000');
```

**2. Verificar se servidor está aceitando WebSocket:**
```bash
# Verificar logs do servidor
docker-compose logs -f app | grep -i websocket
```

**3. Usar transporte alternativo:**
```yaml
# websocket-test.yml
config:
  engines:
    socketio:
      transports: ['polling', 'websocket']  # Adicionar polling
```

---

### 8. "Too many open files"

**Sintoma:**
```
Error: EMFILE: too many open files
```

**Causa:** Sistema operacional limitando número de arquivos abertos

**Solução:**

**Linux/Mac:**
```bash
# Aumentar limite temporariamente
ulimit -n 65536

# Verificar novo limite
ulimit -n
```

**Permanente (Linux):**
```bash
# Editar /etc/security/limits.conf
sudo nano /etc/security/limits.conf

# Adicionar:
* soft nofile 65536
* hard nofile 65536

# Logout e login novamente
```

---

### 9. Resultados inconsistentes

**Sintoma:**
- Um teste passa, outro falha com mesma configuração
- Resultados variam muito entre execuções

**Causa:** 
- Outros processos usando recursos
- Cache afetando resultados
- Estado do sistema diferente

**Solução:**

**1. Limpar estado antes de testar:**
```bash
# Reiniciar todos os serviços
docker-compose down
docker-compose up -d

# Aguardar sistema estabilizar
sleep 30

# Executar teste
npm run load-test:medium
```

**2. Fechar outros aplicativos:**
```bash
# Verificar processos usando muitos recursos
top
# ou
htop

# Fechar aplicativos desnecessários
```

**3. Executar testes múltiplas vezes:**
```bash
# Script para executar 3 vezes e comparar
for i in 1 2 3; do
  echo "Teste $i"
  npx artillery run load-tests/http-medium-load.yml
  sleep 60
done
```

---

### 10. Dados de teste poluindo banco

**Sintoma:**
- Banco de dados com milhares de usuários de teste
- Performance degradando ao longo do tempo

**Solução:**

**1. Limpar dados de teste:**
```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U postgres -d football_db

# Deletar usuários de teste
DELETE FROM users WHERE username LIKE 'user_%' OR username LIKE 'loadtest_%';
DELETE FROM users WHERE username LIKE 'stress_%';

# Sair
\q
```

**2. Usar banco de dados separado para testes:**
```yaml
# Criar docker-compose.test.yml
services:
  postgres-test:
    image: postgres:17
    environment:
      POSTGRES_DB: football_db_test
```

```bash
# Executar testes no banco de teste
docker-compose -f docker-compose.test.yml up -d
npm run load-test:light
docker-compose -f docker-compose.test.yml down -v
```

---

### 11. Artillery consumindo muita memória

**Sintoma:**
```
Artillery process usando > 2GB RAM
```

**Causa:** Muitos usuários virtuais simultâneos

**Solução:**

**1. Reduzir carga:**
```yaml
phases:
  - duration: 60
    arrivalRate: 20  # Reduzir de 100 para 20
```

**2. Executar em máquina com mais recursos**

**3. Dividir teste em partes menores:**
```bash
# Em vez de um teste de 300 req/s
# Fazer 3 testes de 100 req/s
npm run load-test:medium  # 50 req/s
sleep 120
npm run load-test:medium  # 50 req/s
sleep 120
npm run load-test:medium  # 50 req/s
```

---

### 12. Variáveis não sendo substituídas

**Sintoma:**
```
# Na requisição aparece literal:
username: "{{ testUser }}"
# Em vez de:
username: "meu_usuario"
```

**Causa:** Sintaxe incorreta ou variável não definida

**Solução:**

**1. Verificar definição de variável:**
```yaml
config:
  variables:
    testUser: "meu_usuario"  # Definir aqui
```

**2. Usar sintaxe correta:**
```yaml
# ✅ CORRETO
username: "{{ testUser }}"

# ❌ ERRADO
username: {{ testUser }}       # Sem aspas
username: "{ testUser }"       # Apenas uma chave
username: "{{testUser}}"       # Sem espaços
```

---

## 📋 Checklist de Debug

Quando um teste falhar, seguir este checklist:

- [ ] 1. Servidor está rodando? (`curl http://localhost:3000`)
- [ ] 2. Banco de dados conectado? (`docker-compose ps`)
- [ ] 3. Logs do servidor mostram erros? (`docker-compose logs app`)
- [ ] 4. Recursos suficientes? (`docker stats`)
- [ ] 5. Sintaxe do YAML correta? (`npx artillery dino arquivo.yml`)
- [ ] 6. Executando do diretório correto? (`pwd`)
- [ ] 7. Versão do Artillery correta? (`npx artillery --version`)
- [ ] 8. Timeout adequado para carga? (editar `config.timeout`)
- [ ] 9. Aguardou entre testes? (`sleep 60`)
- [ ] 10. Teste funciona com carga menor?

---

## 🆘 Ainda com Problemas?

### Ativar modo debug do Artillery

```bash
# Ver mais detalhes durante execução
DEBUG=http npx artillery run load-tests/http-light-load.yml

# Ver TUDO
DEBUG=* npx artillery run load-tests/http-light-load.yml
```

### Executar teste mínimo

```bash
# Criar teste mínimo para validar setup
cat > load-tests/test-minimal.yml << 'EOF'
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 10
      arrivalRate: 1

scenarios:
  - name: "Test básico"
    flow:
      - get:
          url: "/"
EOF

# Executar
npx artillery run load-tests/test-minimal.yml
```

### Testar manualmente

```bash
# Fazer requisição manual para verificar endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"Test123!@#"}'
```

---

## 📚 Recursos Adicionais

- [Artillery Docs - Debugging](https://www.artillery.io/docs/guides/guides/debugging)
- [Guia Completo](./README.md)
- [Exemplos](./EXEMPLOS-VISUAIS.md)

---

**Ainda precisa de ajuda?** 
- Verifique os logs do servidor em detalhes
- Teste com configurações mais simples primeiro
- Compare com os exemplos fornecidos
