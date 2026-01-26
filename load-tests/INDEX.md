# 📚 Índice da Documentação de Testes de Carga

Bem-vindo à documentação completa de testes de carga com Artillery para o projeto Distributed Multiplayer Football.

## 🚀 Começar Rapidamente

**Novo no Artillery?** Comece aqui:

1. **[Guia Rápido](./GUIA-RAPIDO.md)** ⭐
   - Comandos básicos
   - Como executar testes
   - Leitura rápida de resultados
   - 5 minutos de leitura

## 📖 Documentação Principal

### Para Usuários

2. **[README Completo](./README.md)** 📘
   - Documentação detalhada e completa
   - Explicação de todos os parâmetros
   - Como ajustar configurações
   - Criar cenários personalizados
   - 30 minutos de leitura

3. **[Guia de Relatórios](./RELATORIOS.md)** 📊
   - Como gerar relatórios HTML
   - Analisar resultados visualmente
   - Comparar resultados antes/depois
   - 15 minutos de leitura

4. **[Exemplos Visuais](./EXEMPLOS-VISUAIS.md)** 🎨
   - Visualização de padrões de carga
   - Diferentes tipos de testes
   - Calculando carga total
   - Métricas esperadas
   - 20 minutos de leitura

5. **[Comparação de Testes](./COMPARACAO.md)** 🔍
   - Quando usar cada teste
   - Diferenças entre testes
   - Fluxos recomendados
   - Resultados esperados
   - 25 minutos de leitura

6. **[Troubleshooting](./TROUBLESHOOTING.md)** 🔧
   - Problemas comuns e soluções
   - Checklist de debug
   - Como resolver erros
   - 15 minutos de leitura

### Para Desenvolvedores

7. **[Template de Configuração](./config-template.yml)** ⚙️
   - Template comentado
   - Exemplos de configuração
   - Base para criar novos testes

8. **[Funções JavaScript](./functions.js)** 💻
   - Funções auxiliares
   - Como criar funções customizadas

## 📁 Arquivos de Teste

### Testes HTTP (REST API)

9. **[http-light-load.yml](./http-light-load.yml)**
   - Carga leve: 10-20 req/s
   - Duração: ~2 minutos
   - Comando: `npm run load-test:light`

10. **[http-medium-load.yml](./http-medium-load.yml)**
    - Carga média: 20-50 req/s
    - Duração: ~4 minutos
    - Comando: `npm run load-test:medium`

11. **[http-heavy-load.yml](./http-heavy-load.yml)**
    - Carga pesada: 30-150 req/s
    - Duração: ~3.5 minutos
    - Comando: `npm run load-test:heavy`

12. **[stress-test.yml](./stress-test.yml)**
    - Teste de estresse: 50-300 req/s
    - Duração: ~3 minutos
    - Comando: `npm run load-test:stress`

### Testes WebSocket (Socket.IO)

13. **[websocket-test.yml](./websocket-test.yml)**
    - Teste de WebSocket/Socket.IO
    - Conexões: 2-5 por segundo
    - Duração: ~3 minutos
    - Comando: `npm run load-test:websocket`

## 🎯 Guia de Navegação por Objetivo

### Quero começar a testar AGORA
→ [Guia Rápido](./GUIA-RAPIDO.md)

### Quero entender todos os parâmetros
→ [README Completo](./README.md)

### Quero criar um teste personalizado
→ [Template de Configuração](./config-template.yml)

### Quero entender visualmente os padrões de carga
→ [Exemplos Visuais](./EXEMPLOS-VISUAIS.md)

### Não sei qual teste usar
→ [Comparação de Testes](./COMPARACAO.md)

### Meu teste está falhando
→ [Troubleshooting](./TROUBLESHOOTING.md)

### Quero gerar relatórios bonitos
→ [Guia de Relatórios](./RELATORIOS.md)

## 📈 Fluxo de Aprendizado Recomendado

```
1. Guia Rápido
   ↓
2. Executar http-light-load.yml
   ↓
3. Ver resultados e entender métricas
   ↓
4. Ler README Completo
   ↓
5. Experimentar diferentes testes
   ↓
6. Gerar relatórios HTML
   ↓
7. Criar teste personalizado
   ↓
8. Consultar Comparação quando necessário
   ↓
9. Usar Troubleshooting se houver problemas
```

## 🎓 Níveis de Conhecimento

### Iniciante
**Tempo estimado:** 1-2 horas

1. [Guia Rápido](./GUIA-RAPIDO.md)
2. Executar `npm run load-test:light`
3. [Troubleshooting](./TROUBLESHOOTING.md) básico

**Você saberá:**
- Executar testes básicos
- Ler resultados principais
- Resolver problemas comuns

### Intermediário
**Tempo estimado:** 3-4 horas

1. [README Completo](./README.md)
2. [Guia de Relatórios](./RELATORIOS.md)
3. [Exemplos Visuais](./EXEMPLOS-VISUAIS.md)
4. Executar todos os testes

**Você saberá:**
- Ajustar parâmetros
- Gerar e analisar relatórios
- Entender padrões de carga
- Escolher teste apropriado

### Avançado
**Tempo estimado:** 5-8 horas

1. [Comparação de Testes](./COMPARACAO.md)
2. [Template de Configuração](./config-template.yml)
3. [Funções JavaScript](./functions.js)
4. Criar testes customizados

**Você saberá:**
- Criar testes personalizados
- Otimizar configurações
- Interpretar resultados avançados
- Planejar estratégias de teste

## 📊 Estrutura de Diretórios

```
load-tests/
├── README.md                    # Documentação principal
├── GUIA-RAPIDO.md              # Início rápido
├── RELATORIOS.md               # Guia de relatórios
├── EXEMPLOS-VISUAIS.md         # Visualizações
├── COMPARACAO.md               # Comparação de testes
├── TROUBLESHOOTING.md          # Solução de problemas
├── INDEX.md                    # Este arquivo
├── config-template.yml         # Template para criar testes
├── functions.js                # Funções auxiliares
├── http-light-load.yml         # Teste leve
├── http-medium-load.yml        # Teste médio
├── http-heavy-load.yml         # Teste pesado
├── stress-test.yml             # Teste de estresse
└── websocket-test.yml          # Teste WebSocket
```

## 🔗 Links Rápidos

### Comandos Mais Usados

```bash
# Executar testes
npm run load-test:light
npm run load-test:medium
npm run load-test:heavy
npm run load-test:stress
npm run load-test:websocket

# Gerar relatório
npx artillery run --output report.json load-tests/http-medium-load.yml
npx artillery report report.json

# Debug
DEBUG=http npx artillery run load-tests/http-light-load.yml
```

### Arquivos para Editar

- **Mudar servidor:** Editar `target:` em qualquer `.yml`
- **Ajustar carga:** Editar `arrivalRate:` em qualquer `.yml`
- **Criar novo teste:** Copiar `config-template.yml`
- **Adicionar funções:** Editar `functions.js`

## 📞 Precisa de Ajuda?

1. **Problema específico?** → [Troubleshooting](./TROUBLESHOOTING.md)
2. **Dúvida sobre parâmetro?** → [README Completo](./README.md)
3. **Não sabe qual teste usar?** → [Comparação](./COMPARACAO.md)
4. **Quer exemplo visual?** → [Exemplos Visuais](./EXEMPLOS-VISUAIS.md)

## 🌟 Recursos Externos

- [Artillery Official Docs](https://www.artillery.io/docs)
- [Artillery GitHub](https://github.com/artilleryio/artillery)
- [Socket.IO Load Testing](https://www.artillery.io/docs/guides/guides/socketio-reference)

## 📝 Checklist de Primeiros Passos

- [ ] 1. Ler [Guia Rápido](./GUIA-RAPIDO.md)
- [ ] 2. Garantir que servidor está rodando
- [ ] 3. Executar `npm run load-test:light`
- [ ] 4. Analisar resultados
- [ ] 5. Gerar relatório HTML
- [ ] 6. Ler [README Completo](./README.md)
- [ ] 7. Experimentar outros testes
- [ ] 8. Criar teste personalizado

## 🎯 Objetivos de Aprendizado

Ao completar esta documentação, você será capaz de:

✅ Executar testes de carga básicos  
✅ Interpretar resultados de performance  
✅ Ajustar parâmetros de teste  
✅ Gerar relatórios HTML profissionais  
✅ Criar testes personalizados  
✅ Identificar gargalos de performance  
✅ Planejar capacidade do sistema  
✅ Validar sistema antes de deploys  

## 📆 Última Atualização

**Data:** Janeiro 2026  
**Versão Artillery:** 1.7.9  
**Projeto:** Distributed Multiplayer Football  
**Instituição:** Universidade Federal de Sergipe (UFS)

---

**Pronto para começar?** → [Guia Rápido](./GUIA-RAPIDO.md) ⭐
