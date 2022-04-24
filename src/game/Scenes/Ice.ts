import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "./CTCEvent";
import ElementController from "../Element/ElementController";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";

export default class Ice extends BaseStage {
    protected endposition : Vec2;

    loadScene(){
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.tilemap("level", "game_assets/tilemaps/ice.json");// TODO: switch to ice map
        this.load.object("board", "game_assets/data/test_board.json");// TODO: switch to ice board
        this.load.image("portal", "game_assets/sprites/portal.png");
        this.load.spritesheet("whirlwind", "game_assets/spritesheets/whirlwind.json");
        this.load.image("gust", "game_assets/sprites/gust.png");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        this.load.image("bubble", "game_assets/sprites/bubble.png");
        this.load.image("wave", "game_assets/sprites/wave.png");
        this.load.image("shallow_water", "game_assets/sprites/shallow_water.png");
        this.load.image("deep_water", "game_assets/sprites/deep_water.png");
        this.load.spritesheet("ember", "game_assets/spritesheets/ember.json");
        this.load.image("flames", "game_assets/sprites/flames.png");
        this.load.image("ignite", "game_assets/sprites/ignite.png");
        this.load.image("ice_cube", "game_assets/sprites/ice_cube.png");
        this.load.spritesheet("torch", "game_assets/spritesheets/torch.json");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
    }

    unloadScene(): void {
        this.load.keepImage("rock_M");
        this.load.keepImage("whirlwind");
        this.load.keepImage("gust");
        this.load.keepSpritesheet("airstream");
        this.load.keepSpritesheet("god");
        this.load.keepSpritesheet("element_equipped");
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");

        this.initializeGameboard();

        this.initializePlayer();

        this.elementGUI.animation.play("earth_equipped");
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        let player_controller = (<PlayerController>this.player._ai);
        let dirVec = player_controller.dirUnitVector();
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            switch(event.type){
                case CTCevent.INTERACT_ELEMENT:
                    var targetposX = event.data.get("positionX");
                    var targetposY = event.data.get("positionY");
                    var target = this.gameboard[targetposX][targetposY];
                    if(target != null) {
                        this.activateElement(target, targetposX, targetposY, dirVec);
                    }
                    break;
                case CTCevent.PLACE_ELEMENT:
                    let placeX = event.data.get("positionX");
                    let placeY = event.data.get("positionY");
                    let type = event.data.get("type");
                    if (placeX>=2 && placeX<=17 && placeY>=2 && placeY<=17) {
                        let player_controller = (<PlayerController>this.player._ai);
                        player_controller.cast_animation();
                        if (this.gameboard[placeX][placeY] == null) {
                            this.place_element(placeX, placeY, type);
                        } else {
                            switch(event.data.get("type")){
                                case 1:
                                    if(this.gameboard[placeX][placeY].imageId == "rock_P") {
                                        let sprite = this.gameboard[placeX][placeY];
                                        sprite.destroy();
                                        this.gameboard[placeX][placeY] = null;
                                        this.skillUsed[0] = false;
                                    }
                                    break;
                                case 2:
                                    if(this.gameboard[placeX][placeY].imageId== "whirlwind") {
                                        let sprite = this.gameboard[placeX][placeY];
                                        sprite.destroy();
                                        this.gameboard[placeX][placeY] = null;
                                        this.skillUsed[1] = false;
                                    }
                                    break;
                                case 3:
                                    if(this.gameboard[placeX][placeY].imageId == "bubble") {
                                        let sprite = this.gameboard[placeX][placeY];
                                        sprite.destroy();
                                        this.gameboard[placeX][placeY] = null;
                                        this.skillUsed[2] = false;
                                    }
                                    break;
                                case 4:
                                    if(this.gameboard[placeX][placeY].imageId == "ember") {
                                        let sprite = this.gameboard[placeX][placeY];
                                        sprite.destroy();
                                        this.gameboard[placeX][placeY] = null;
                                        this.skillUsed[3] = false;
                                    }
                                    break;
                                case 5:
                                    if(this.gameboard[placeX][placeY].imageId == "ice_cube") {
                                        let sprite = this.gameboard[placeX][placeY];
                                        sprite.destroy();
                                        this.gameboard[placeX][placeY] = null;
                                        this.skillUsed[4] = false;
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case CTCevent.CHANGE_ELEMENT:
                    switch(event.data.get("el")){
                        case 1:
                            this.elementSelected = 1;
                            this.elementGUI.animation.play("earth_equipped");
                            break;
                        case 2:
                            this.elementSelected = 2;
                            this.elementGUI.animation.play("wind_equipped");
                            break;
                        case 3:
                            this.elementSelected = 3;
                            this.elementGUI.animation.play("water_equipped");
                            break;
                        case 4:
                            this.elementSelected = 4;
                            this.elementGUI.animation.play("fire_equipped");
                            break;
                        case 5:
                            this.elementSelected = 5;
                            this.elementGUI.animation.play("ice_equipped");
                            break;
                    }
                    break;
                case CTCevent.PLAYER_MOVE_REQUEST:
                    if (BaseStage.paused) Input.enableInput();
                    var next = event.data.get("next");
                    if(this.gameboard[next.x][next.y]){
                        switch(this.gameboard[next.x][next.y].imageId) {
                            case "rock_P":
                            case "rock_S":
                            case "rock_M":
                            case "rock_L":
                            case "ice_cube":
                                Input.enableInput();
                                break;
                            default:
                                this.emitter.fireEvent(CTCevent.PLAYER_MOVE, {"scaling": 1});
                        }
                    } else {
                        this.emitter.fireEvent(CTCevent.PLAYER_MOVE, {"scaling": 1});
                    }
                    break;
                case CTCevent.CHANGE_ELEMENT:
                    switch(event.data.get("el")){
                        case 1:
                            this.elementGUI.animation.play("earth_equipped");
                            this.elementSelected = 1;
                            break;
                    }
                    break;
            }    
        }
        if(!this.inAir) {
            let playerPosInBoard = this.sprite_pos_to_board_pos(this.player.position.x, this.player.position.y);
            let pRow = playerPosInBoard.x;
            let pCol = playerPosInBoard.y;
            if(this.gameboard[pRow][pCol]){
                switch(this.gameboard[pRow][pCol].imageId){
                    case "rock_P":
                    case "rock_S":
                    case "rock_M":
                    case "rock_L":
                    case "ice_cube":
                        Input.enableInput();
                        break;
                    case "whirlwind":
                        this.savedNum = this.whirlwind_fly(pRow, pCol, dirVec);
                        break;
                    case "bubble":
                        this.bubble_shield(pRow, pCol);
                        break;
                    case "ember":
                        this.ember_extinguish(pRow, pCol);
                        break;
                    case "portal":
                        if(this.endposition.equals(playerPosInBoard)){
                            this.sceneManager.changeToScene(Ice, {});
                        }
                }
            }
        } else {
            if(this.savedNum>0) {
                this.emitter.fireEvent(CTCevent.FLY);
                this.savedNum--;
            } else {
                this.inAir = false;
                Input.enableInput();
            }
        }
    };

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");
        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            var sprite;
            if(element.type === "airstream") {
                sprite = this.add.animatedSprite(element.type, "primary");
                sprite.animation.play("stream");
            } else {
                sprite = this.add.sprite(element.type, "primary");
            }
            sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
            sprite.addAI(ElementController, {}); // useless?
            this.gameboard[element.position[0]][element.position[1]] = sprite;
            if(element.type === "portal") {
                this.endposition = new Vec2(element.position[0], element.position[1]);
            }
        }
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.inAir = false;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,true,true,true]});
    }
}