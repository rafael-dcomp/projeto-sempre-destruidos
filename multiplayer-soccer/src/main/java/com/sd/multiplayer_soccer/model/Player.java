package com.sd.multiplayer_soccer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String socketId;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private GameRoom room;
    
    private Double x = 400.0;
    
    private Double y = 300.0;
    
    @Enumerated(EnumType.STRING)
    private Team team;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum Team {
        RED, BLUE
    }
}
