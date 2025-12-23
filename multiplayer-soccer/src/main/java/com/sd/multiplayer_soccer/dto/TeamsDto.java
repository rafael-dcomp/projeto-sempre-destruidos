package com.sd.multiplayer_soccer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamsDto {
    private List<String> red;
    private List<String> blue;
}
