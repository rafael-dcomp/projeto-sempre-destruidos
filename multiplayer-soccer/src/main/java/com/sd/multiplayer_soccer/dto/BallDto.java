package com.sd.multiplayer_soccer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BallDto {
    private double x;
    private double y;
    private double radius;
    private double speedX;
    private double speedY;
}
