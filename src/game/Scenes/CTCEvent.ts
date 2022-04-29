export enum CTCevent{
    // player events
    PLAYER_MOVE_REQUEST = "player_move_request",
    PLAYER_MOVE = "player_move",
    FLY = "fly",

    //boss events
    BOSS_SKILL = "boss_skill",
    BOSS_TELEPORT = "boss_teleport",
    BOSS_ATTACK = "boss_attack",
    BOSS_DAMAGED = "boss_damaged",
    BOSS_DEAD = "boss_dead",

    //element events
    WHIRLWIND_MOVE = "whirlwind_move",
    CHANGE_ELEMENT = "change_element",
    
    // stage events
    INTERACT_ELEMENT = "interact_element",
    PLACE_ELEMENT = "place_element",
    RESTART_STAGE = "restart",
    CONTROLS_POPUP = "controls_popup",
    BACK_TO_MENU = "back_to_menu",
    TOGGLE_PAUSE = "toggle_pause",
    END_LEVEL = "end_level",
}