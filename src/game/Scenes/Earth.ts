import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "./CTCEvent";
import ElementController from "../Element/ElementController";
import { Player_enums } from "../Player/Player_enums";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";

export default class Earth extends BaseStage {
    protected endposition : Vec2;

    loadScene(){
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.tilemap("level", "game_assets/tilemaps/earth.json");
        this.load.object("board", "game_assets/data/earth_board.json");
        /*unlock all powers for testing
        this.load.spritesheet("whirlwind", "game_assets/spritesheets/whirlwind.json");
        this.load.image("gust", "game_assets/sprites/gust.png");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        this.load.image("bubble", "game_assets/sprites/bubble.png");
        this.load.image("shallow_water", "game_assets/sprites/shallow_water.png");
        this.load.spritesheet("ember", "game_assets/spritesheets/ember.json");
        this.load.image("flames", "game_assets/sprites/flames.png");
        this.load.image("ignite", "game_assets/sprites/ignite.png");
        this.load.image("ice_cube", "game_assets/sprites/ice_cube.png");
        this.load.spritesheet("torch", "game_assets/spritesheets/torch.json");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");*/
    }

    unloadScene(): void {
        this.load.keepImage("rock_M");
        this.load.keepSpritesheet("god");
        this.load.keepSpritesheet("element_equipped");
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");
        this.initializeGameboard();
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,false,false,false,false]});
        this.player.position.set(3*16 + 8, 3*16 + 8);
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            switch(event.type){
                // CTC TODO: interacting and placing (if placing then have to account for the walls so you cant place there)
                case CTCevent.INTERACT_ELEMENT:
                    console.log("interact happened");
                    console.log(event.data.get("positionX"));
                    console.log(event.data.get("positionY"));
                    var targetposX = event.data.get("positionX");
                    var targetposY = event.data.get("positionY");
                    var direction = event.data.get("direction");
                    var target = this.gameboard[targetposX][targetposY];
                    if(target != null) {
                        this.pushRock(target, targetposX, targetposY, direction);
                    }
                    break;
                case CTCevent.PLACE_ELEMENT:
                    let placeX = event.data.get("positionX");
                    let placeY = event.data.get("positionY");
                    if (!(placeX < 2 || placeX > 17 || placeY < 2 || placeY >17)) {
                        if (this.gameboard[placeX][placeY] == null) {
                            switch(event.data.get("type")) {
                                case 1:
                                    if (!(<PlayerController>this.player._ai).hasPower[0]) break;
                                    if(this.skillUsed[0]) break;
                                    this.skillUsed[0] = true;
                                    let place_rock = this.add.sprite("rock_P", "primary");
                                    place_rock.position.set(placeX*16+8, placeY*16+8);
                                    place_rock.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_rock.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_rock;
                                    break;
                                case 2:
                                    if (!(<PlayerController>this.player._ai).hasPower[1]) break;
                                    if(this.skillUsed[1]) break;
                                    this.skillUsed[1] = true;
                                    let place_wind = this.add.animatedSprite("whirlwind", "primary");
                                    place_wind.position.set(placeX*16 + 8, placeY*16 + 8);
                                    place_wind.animation.play("idle");
                                    place_wind.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
                                    place_wind.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_wind;
                                    break;
                                case 3:
                                    if (!(<PlayerController>this.player._ai).hasPower[2]) break;
                                    if(this.skillUsed[2]) break;
                                    this.skillUsed[2] = true;
                                    let place_water = this.add.sprite("bubble", "primary");
                                    place_water.position.set(placeX*16+8, placeY*16+8);
                                    place_water.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_water.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_water;
                                    break;
                                case 4:
                                    if (!(<PlayerController>this.player._ai).hasPower[3]) break;
                                    if(this.skillUsed[3]) break;
                                    this.skillUsed[3] = true;
                                    let place_fire = this.add.animatedSprite("ember", "primary");
                                    place_fire.position.set(placeX*16 + 8, placeY*16 + 8);
                                    place_fire.animation.play("idle");
                                    place_fire.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
                                    place_fire.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_fire;
                                    break;
                                case 5:
                                    if (!(<PlayerController>this.player._ai).hasPower[4]) break;
                                    if(this.skillUsed[4]) break;
                                    this.skillUsed[4] = true;
                                    let place_ice = this.add.sprite("ice_cube", "primary");
                                    place_ice.position.set(placeX*16+8, placeY*16+8);
                                    place_ice.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_ice.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_ice;
                                    break;
                            }
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
                case CTCevent.PLAYER_MOVE_REQUEST:
                    var next = event.data.get("next");
                    if(this.gameboard[next.x][next.y] == null || this.endposition == next){
                        this.emitter.fireEvent(CTCevent.PLAYER_MOVE, {"scaling": 1});
                        if(this.endposition == next){
                            this.emitter.fireEvent(CTCevent.END_LEVEL, {"nextlevel" : "earth_boss"});
                        }
                    }
                    break;
            }    
        }
    };

    // CTC TODO: if level-end portal is a sprite, then right here you could make this.portal (a Sprite field) and test this.player.position === this.portal.position to fire LEVEL_END event. In this case you could refer to the following to initialize the portal (add this code in its own function or maybe right at the end of initializePlayer function?):
        /*
        this.portal = this.add.sprite("portal", "primary"); **HAVE TO LOAD PORTAL AS IMAGE IN LOADSCENE FUNCTION
        this.player.position.set(3*16 + 8, 3*16 + 8); **CHANGE THE 3s TO BE SOME OTHER TILE POSITION
        this.portal.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.portal.addAI(ElementController, {});

        if the sprite is animated then you're on your own tbh lol, this should work for a non-animated sprite i hope
        */

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");
        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            let sprite = this.add.sprite(element.type, "primary");
            sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
            sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
            sprite.addAI(ElementController, {});
            this.gameboard[element.position[0]][element.position[1]] = sprite;
        }
        //set portal 
        //this.gameboard[this.endposition.x][this.endposition.y] = 
    }
}