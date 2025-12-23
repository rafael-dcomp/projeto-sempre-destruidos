package com.sd.multiplayer_soccer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameStateDto {
    private int width;
    private int height;
    private Map<String, PlayerDto> players;
    private BallDto ball;
    private ScoreDto score;
    private TeamsDto teams;
    private int matchTime;
    private boolean isPlaying;
    private String roomId;
}
