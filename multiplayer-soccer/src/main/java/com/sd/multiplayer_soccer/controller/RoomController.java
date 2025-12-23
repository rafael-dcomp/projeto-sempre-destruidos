package com.sd.multiplayer_soccer.controller;

import com.sd.multiplayer_soccer.dto.GameStateDto;
import com.sd.multiplayer_soccer.model.GameRoom;
import com.sd.multiplayer_soccer.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {
    
    private final GameService gameService;
    
    @GetMapping("/available")
    public ResponseEntity<String> getAvailableRoom() {
        String roomId = gameService.findOrCreateAvailableRoom();
        return ResponseEntity.ok(roomId);
    }
    
    @GetMapping("/{roomId}")
    public ResponseEntity<GameRoom> getRoom(@PathVariable String roomId) {
        GameRoom room = gameService.getOrCreateRoom(roomId);
        return ResponseEntity.ok(room);
    }
    
    @GetMapping("/{roomId}/state")
    public ResponseEntity<GameStateDto> getGameState(@PathVariable String roomId) {
        GameStateDto state = gameService.getGameState(roomId);
        return ResponseEntity.ok(state);
    }
}
