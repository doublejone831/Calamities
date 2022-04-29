export enum Element {
    ROCK_S = "rock_S", // light rock, move 3 tiles, can damage bosses
    ROCK_M = "rock_M", // medium rock, move 2 tiles, can damage bosses
    ROCK_L = "rock_L", // heavy rock, move 1 tile, can damage bosses
    ROCK_P = "rock_P", // PLAYER SKILL, move to the end
    TORNADO = "tornado", // ANIMATED, moves in specified path, moves player 2 tiles in player direction
    AIRSTREAM = "airstream", // ANIMATED, line of wind, moves player to the end of the wind direction
    WHIRLWIND = "whirlwind", // ANIMATED, PLAYER SKILL, stationary tornado, becomes airstream when interacted
    SHALLOW_WATER = "shallow_water", // becomes normal ground after 1 rock filling
    DEEP_WATER = "deep_water", // becomes shallow water after 1 rock filling
    BUBBLE = "bubble", // PLAYER SKILL, gives player a one-use shield, becomes wave when interacted
    WAVE = "wave", // moves 1 tiles at a time, extinguishes any flames it touches, can damage fire boss
    FLAMES = "flames", // burns player, breaks player shield
    EMBER = "ember", // ANIMATED, PLAYER SKILL, disapears when stepped on, shoots fire on next tile when interacted
    IGNITE = "ignite", // lights up torches, can damage ice boss
    TORCH = "torch", // switch for mechanisms, brighten up stage
    ICE_CUBE = "ice_cube" // moves to the end, can be melted with fire
}