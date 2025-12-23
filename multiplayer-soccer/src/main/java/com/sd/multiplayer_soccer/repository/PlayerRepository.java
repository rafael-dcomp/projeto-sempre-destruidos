package com.sd.multiplayer_soccer.repository;

import com.sd.multiplayer_soccer.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findBySocketId(String socketId);
    List<Player> findByRoomId(Long roomId);
    void deleteBySocketId(String socketId);
}
