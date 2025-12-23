# Multiplayer Soccer - Spring Boot + React

Jogo de futebol **multiplayer 2D em tempo real** construído com **Java Spring Boot**, **React**, **WebSocket (STOMP)** e **PostgreSQL**.

## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
  - Spring Web
  - Spring WebSocket (STOMP)
  - Spring Data JPA
  - Lombok
- **PostgreSQL 15**
- **Maven**

### Frontend
- **React 18**
- **STOMP.js** para WebSocket
- **SockJS** para fallback de conexão

### Infraestrutura
- **Docker & Docker Compose**
- **Nginx** (proxy reverso e servidor estático)

## 📁 Estrutura do Projeto

```
projeto-sempre-destruidos/
├── multiplayer-soccer/          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sd/multiplayer_soccer/
│   │   │   │   ├── config/          # Configurações (WebSocket)
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entidades JPA
│   │   │   │   ├── repository/      # Repositórios JPA
│   │   │   │   ├── service/         # Lógica de negócio
│   │   │   │   └── websocket/       # Controllers WebSocket
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── soccer-frontend/             # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Game.js
│   │   │   └── Game.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml           # Orquestração completa
```

## 🛠️ Pré-requisitos

### Desenvolvimento Local

- **Java 17** ou superior
- **Node.js 18+** e **npm**
- **PostgreSQL 15+**
- **Maven 3.9+**

### Com Docker

- **Docker** e **Docker Compose**

## 🚀 Instalação e Execução

### Opção 1: Desenvolvimento Local

#### 1. PostgreSQL
```bash
# Criar banco de dados
createdb multiplayer_soccer

# Ou via SQL
psql -U postgres
CREATE DATABASE multiplayer_soccer;
```

#### 2. Backend (Spring Boot)
```bash
cd multiplayer-soccer

# Compilar o projeto
./mvnw clean install

# Executar
./mvnw spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

#### 3. Frontend (React)
```bash
cd soccer-frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

O frontend estará disponível em `http://localhost:3000`

### Opção 2: Com Docker Compose

```bash
# Na raiz do projeto
docker-compose up --build
```

Isso irá:
- Criar o banco PostgreSQL na porta 5432
- Compilar e executar o backend Spring Boot na porta 8080
- Compilar e executar o frontend React com Nginx na porta 3000

Acesse o jogo em: `http://localhost:3000`

## 🎮 Como Jogar

1. **Abra o navegador** e acesse `http://localhost:3000`
2. **Entre em uma sala**: 
   - O sistema automaticamente te coloca em uma sala disponível
   - Ou use `http://localhost:3000?room=nome-da-sala` para entrar em sala específica
3. **Controles**:
   - **WASD** ou **Setas**: Movimento
   - **Espaço**: Ação

## 🏗️ Arquitetura

### Backend (Spring Boot)

#### WebSocket Configuration
- Utiliza **STOMP** sobre **SockJS**
- Endpoint: `/ws`
- Prefixos:
  - `/app`: Mensagens do cliente para servidor
  - `/topic`: Broadcast do servidor para clientes

#### REST API
- `GET /api/rooms/available`: Retorna uma sala disponível
- `GET /api/rooms/{roomId}`: Retorna informações da sala
- `GET /api/rooms/{roomId}/state`: Retorna estado do jogo

#### WebSocket Messages
- `/app/join/{roomId}`: Jogador entra na sala
- `/app/input/{roomId}`: Envia comandos do jogador
- `/app/ready/{roomId}`: Jogador pronto para reiniciar
- `/topic/room/{roomId}`: Recebe atualizações do estado do jogo

### Frontend (React)

#### Componentes
- **App.js**: Gerencia conexão e lobby
- **Game.js**: Renderiza o jogo e gerencia WebSocket

#### Comunicação
- Conecta via **STOMP** usando **SockJS**
- Envia inputs a 60 FPS
- Renderiza o canvas baseado no estado recebido

## 🗄️ Banco de Dados

### Tabelas

#### game_rooms
- `id`: Primary key
- `room_id`: Identificador único da sala
- `width`, `height`: Dimensões do campo
- `red_score`, `blue_score`: Placar
- `match_time`: Tempo de partida
- `is_playing`: Status da partida
- `waiting_for_restart`: Aguardando reinício
- `created_at`, `updated_at`: Timestamps

#### players
- `id`: Primary key
- `socket_id`: ID da sessão WebSocket
- `room_id`: Foreign key para game_rooms
- `x`, `y`: Posição do jogador
- `team`: Time (RED ou BLUE)
- `created_at`: Timestamp

## 🔧 Configuração

### Backend (application.properties)

```properties
# Porta do servidor
server.port=8080

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/multiplayer_soccer
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend (package.json)

```json
{
  "proxy": "http://localhost:8080"
}
```

## 📝 Próximos Passos

### Backend
- [ ] Implementar game loop completo (física da bola, colisões)
- [ ] Adicionar lógica de gols e cantos
- [ ] Implementar temporizador de partida
- [ ] Adicionar sistema de reinício de partida
- [ ] Melhorar balanceamento de times
- [ ] Adicionar testes unitários e de integração

### Frontend
- [ ] Melhorar animações e efeitos visuais
- [ ] Adicionar sons e música
- [ ] Implementar tela de vitória/derrota
- [ ] Adicionar chat entre jogadores
- [ ] Melhorar responsividade mobile
- [ ] Adicionar testes

### Infraestrutura
- [ ] Configurar CI/CD
- [ ] Deploy em cloud (AWS/Heroku/Railway)
- [ ] Configurar monitoramento e logs
- [ ] Adicionar healthchecks

## 📜 Licença

ISC License

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🐛 Problemas Conhecidos

- A física do jogo precisa ser implementada no backend
- O game loop ainda não está completo
- Necessário implementar detecção de colisões
- Sistema de pontuação precisa ser integrado com o WebSocket

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
