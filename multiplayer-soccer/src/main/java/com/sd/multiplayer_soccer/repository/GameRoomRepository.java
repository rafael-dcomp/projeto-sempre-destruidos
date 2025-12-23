package com.sd.multiplayer_soccer.repository;

import com.sd.multiplayer_soccer.model.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByRoomId(String roomId);
    boolean existsByRoomId(String roomId);
}
