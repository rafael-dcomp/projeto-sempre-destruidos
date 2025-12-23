package com.sd.multiplayer_soccer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerInputDto {
    private boolean left;
    private boolean right;
    private boolean up;
    private boolean down;
    private boolean action;
}
