package com.sd.multiplayer_soccer.websocket;

import com.sd.multiplayer_soccer.dto.GameStateDto;
import com.sd.multiplayer_soccer.dto.PlayerDto;
import com.sd.multiplayer_soccer.dto.PlayerInputDto;
import com.sd.multiplayer_soccer.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameWebSocketController {
    
    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/join/{roomId}")
    public void joinRoom(@DestinationVariable String roomId, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        
        if (gameService.isRoomFull(roomId)) {
            messagingTemplate.convertAndSendToUser(
                    sessionId,
                    "/queue/error",
                    "Room is full"
            );
            return;
        }
        
        PlayerDto player = gameService.addPlayer(roomId, sessionId);
        
        // Send initial game state to the player
        GameStateDto gameState = gameService.getGameState(roomId);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, gameState);
        
        log.info("Player {} joined room {}", sessionId, roomId);
    }
    
    @MessageMapping("/input/{roomId}")
    public void handlePlayerInput(
            @DestinationVariable String roomId,
            @Payload PlayerInputDto input,
            SimpMessageHeaderAccessor headerAccessor) {
        
        String sessionId = headerAccessor.getSessionId();
        gameService.updatePlayerInput(roomId, sessionId, input);
    }
    
    @MessageMapping("/ready/{roomId}")
    public void playerReady(@DestinationVariable String roomId, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Player {} ready in room {}", sessionId, roomId);
        
        // TODO: Implement ready logic for match restart
    }
}
