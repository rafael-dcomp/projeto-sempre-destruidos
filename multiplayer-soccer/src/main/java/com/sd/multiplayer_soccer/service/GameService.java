package com.sd.multiplayer_soccer.service;

import com.sd.multiplayer_soccer.dto.*;
import com.sd.multiplayer_soccer.model.GameRoom;
import com.sd.multiplayer_soccer.model.Player;
import com.sd.multiplayer_soccer.repository.GameRoomRepository;
import com.sd.multiplayer_soccer.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
    
    private final GameRoomRepository gameRoomRepository;
    private final PlayerRepository playerRepository;
    
    // In-memory state for real-time game
    private final Map<String, Map<String, PlayerDto>> roomPlayers = new ConcurrentHashMap<>();
    private final Map<String, BallDto> roomBalls = new ConcurrentHashMap<>();
    private final Map<String, TeamsDto> roomTeams = new ConcurrentHashMap<>();
    private final Map<String, Map<String, PlayerInputDto>> playerInputs = new ConcurrentHashMap<>();
    
    private static final int MAX_PLAYERS_PER_ROOM = 6;
    private static final double PLAYER_RADIUS = 20.0;
    private static final double BALL_RADIUS = 10.0;
    
    public GameRoom getOrCreateRoom(String roomId) {
        Optional<GameRoom> existingRoom = gameRoomRepository.findByRoomId(roomId);
        
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }
        
        GameRoom newRoom = new GameRoom();
        newRoom.setRoomId(roomId);
        newRoom.setWidth(800);
        newRoom.setHeight(600);
        newRoom.setRedScore(0);
        newRoom.setBlueScore(0);
        newRoom.setMatchTime(60);
        newRoom.setIsPlaying(false);
        newRoom.setWaitingForRestart(false);
        
        return gameRoomRepository.save(newRoom);
    }
    
    public String findOrCreateAvailableRoom() {
        List<GameRoom> allRooms = gameRoomRepository.findAll();
        
        for (GameRoom room : allRooms) {
            int playerCount = getPlayerCount(room.getRoomId());
            if (playerCount < MAX_PLAYERS_PER_ROOM) {
                return room.getRoomId();
            }
        }
        
        // Create new room
        String newRoomId = "room-" + (allRooms.size() + 1);
        getOrCreateRoom(newRoomId);
        return newRoomId;
    }
    
    @Transactional
    public PlayerDto addPlayer(String roomId, String socketId) {
        GameRoom room = getOrCreateRoom(roomId);
        
        // Initialize room structures if not exists
        roomPlayers.putIfAbsent(roomId, new ConcurrentHashMap<>());
        roomTeams.putIfAbsent(roomId, new TeamsDto(new ArrayList<>(), new ArrayList<>()));
        playerInputs.putIfAbsent(roomId, new ConcurrentHashMap<>());
        
        // Initialize ball if not exists
        if (!roomBalls.containsKey(roomId)) {
            roomBalls.put(roomId, new BallDto(400, 300, BALL_RADIUS, 0, 0));
        }
        
        // Determine team (balance teams)
        TeamsDto teams = roomTeams.get(roomId);
        String team = teams.getRed().size() <= teams.getBlue().size() ? "red" : "blue";
        
        // Add to team
        if (team.equals("red")) {
            teams.getRed().add(socketId);
        } else {
            teams.getBlue().add(socketId);
        }
        
        // Create player DTO
        Random random = new Random();
        double x = 100 + random.nextDouble() * 600;
        double y = 100 + random.nextDouble() * 400;
        
        PlayerDto playerDto = new PlayerDto(socketId, x, y, team);
        roomPlayers.get(roomId).put(socketId, playerDto);
        
        // Initialize input
        playerInputs.get(roomId).put(socketId, new PlayerInputDto(false, false, false, false, false));
        
        // Save to database
        Player player = new Player();
        player.setSocketId(socketId);
        player.setRoom(room);
        player.setX(x);
        player.setY(y);
        player.setTeam(team.equals("red") ? Player.Team.RED : Player.Team.BLUE);
        playerRepository.save(player);
        
        log.info("Player {} added to room {} in team {}", socketId, roomId, team);
        
        return playerDto;
    }
    
    @Transactional
    public void removePlayer(String socketId) {
        // Find and remove from all rooms
        for (Map.Entry<String, Map<String, PlayerDto>> entry : roomPlayers.entrySet()) {
            String roomId = entry.getKey();
            Map<String, PlayerDto> players = entry.getValue();
            
            if (players.containsKey(socketId)) {
                PlayerDto player = players.get(socketId);
                players.remove(socketId);
                
                // Remove from team
                TeamsDto teams = roomTeams.get(roomId);
                if (teams != null) {
                    teams.getRed().remove(socketId);
                    teams.getBlue().remove(socketId);
                }
                
                // Remove input
                Map<String, PlayerInputDto> inputs = playerInputs.get(roomId);
                if (inputs != null) {
                    inputs.remove(socketId);
                }
                
                log.info("Player {} removed from room {}", socketId, roomId);
                break;
            }
        }
        
        // Remove from database
        playerRepository.deleteBySocketId(socketId);
    }
    
    public void updatePlayerInput(String roomId, String socketId, PlayerInputDto input) {
        Map<String, PlayerInputDto> inputs = playerInputs.get(roomId);
        if (inputs != null) {
            inputs.put(socketId, input);
        }
    }
    
    public GameStateDto getGameState(String roomId) {
        GameRoom room = gameRoomRepository.findByRoomId(roomId)
                .orElseGet(() -> getOrCreateRoom(roomId));
        
        Map<String, PlayerDto> players = roomPlayers.getOrDefault(roomId, new HashMap<>());
        BallDto ball = roomBalls.getOrDefault(roomId, new BallDto(400, 300, BALL_RADIUS, 0, 0));
        TeamsDto teams = roomTeams.getOrDefault(roomId, new TeamsDto(new ArrayList<>(), new ArrayList<>()));
        
        ScoreDto score = new ScoreDto(room.getRedScore(), room.getBlueScore());
        
        return new GameStateDto(
                room.getWidth(),
                room.getHeight(),
                players,
                ball,
                score,
                teams,
                room.getMatchTime(),
                room.getIsPlaying(),
                roomId
        );
    }
    
    public int getPlayerCount(String roomId) {
        Map<String, PlayerDto> players = roomPlayers.get(roomId);
        return players != null ? players.size() : 0;
    }
    
    public boolean isRoomFull(String roomId) {
        return getPlayerCount(roomId) >= MAX_PLAYERS_PER_ROOM;
    }
}
