package com.sd.multiplayer_soccer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDto {
    private String socketId;
    private double x;
    private double y;
    private String team;
}
