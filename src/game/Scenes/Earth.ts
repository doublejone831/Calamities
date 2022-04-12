import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { CTCevent } from "./CTCEvent";
import ElementController from "../Element/ElementController";
import { Player_enums } from "../Player/Player_enums";

export default class Earth extends Scene {
    private walls: OrthogonalTilemap;
    private player: AnimatedSprite;
    protected gameboard : Array<Array<Sprite>>;
    protected endposition : Vec2;
    private skillUsed : Array<Boolean>;
    private elementGUI : AnimatedSprite;

    loadScene(){
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.tilemap("level", "game_assets/tilemaps/earth.json");

        this.load.object("board", "game_assets/data/earth_board.json");
        //unlock all powers for testing
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
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

         // Get the wall layer 
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.gameboard = new Array(this.walls.getDimensions().y);
        for (var i = 0; i < this.walls.getDimensions().y; i++) {
            this.gameboard[i] = new Array(this.walls.getDimensions().x).fill(null);
        }

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        
        this.addLayer("primary", 10);
        this.elementGUI = this.add.animatedSprite("element_equipped", "primary");
        this.elementGUI.animation.play("none_equipped");
        this.elementGUI.position.set(3*16+4, 19*16);
        this.initializeGameboard();
        
        this.initializePlayer();

        this.skillUsed = [false, false, false, false, false];

        // Zoom in to a reasonable level
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(2.5);

        //this.viewport.follow(this.player);

        this.receiver.subscribe([
                                CTCevent.INTERACT_ELEMENT, 
                                CTCevent.PLACE_ELEMENT,
                                CTCevent.PLAYER_MOVE_REQUEST,
                                CTCevent.CHANGE_ELEMENT
                                 // CTC TODO: subscribe to CTCevent.LEVEL_END event
                                ]);
        
       
    }

    updateScene(){
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
                        this.activateElement(target, targetposX, targetposY, direction);
                    }
                    break;
                case CTCevent.PLACE_ELEMENT:
                    let placeX = event.data.get("positionX");
                    let placeY = event.data.get("positionY");
                    if (!(placeX < 2 || placeX >= this.walls.getDimensions().y - 2 || placeY < 2 || placeY >= this.walls.getDimensions().x - 2)) {
                        if (this.gameboard[placeX][placeY] == null) {
                            switch(event.data.get("type")) {
                                case 1:
                                    if(this.skillUsed[0]) break;
                                    this.skillUsed[0] = true;
                                    let place_rock = this.add.sprite("rock_P", "primary");
                                    place_rock.position.set(placeX*16+8, placeY*16+8);
                                    place_rock.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_rock.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_rock;
                                    break;
                                case 2:
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
                                    if(this.skillUsed[2]) break;
                                    this.skillUsed[2] = true;
                                    let place_water = this.add.sprite("bubble", "primary");
                                    place_water.position.set(placeX*16+8, placeY*16+8);
                                    place_water.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_water.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_water;
                                    break;
                                case 4:
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
                                    if(this.skillUsed[4]) break;
                                    this.skillUsed[4] = true;
                                    let place_ice = this.add.sprite("ice_cube", "primary");
                                    place_ice.position.set(placeX*16+8, placeY*16+8);
                                    place_ice.addPhysics(new AABB(Vec2.ZERO, new Vec2(8,8)));
                                    place_ice.addAI(ElementController, {});
                                    this.gameboard[placeX][placeY] = place_ice;
                                    break;
                            }
                        }
                    }
                    break;
                case CTCevent.PLAYER_MOVE_REQUEST:
                    var next = event.data.get("next");
                    if(this.gameboard[next.x][next.y] == null || this.endposition == next){
                        this.emitter.fireEvent(CTCevent.PLAYER_MOVE);
                        if(this.endposition == next){
                            this.emitter.fireEvent(CTCevent.END_LEVEL, {"nextlevel" : "earth_boss"});
                        }
                    }
                    break;
                case CTCevent.CHANGE_ELEMENT:
                    switch(event.data.get("el")){
                        case 1:
                            this.elementGUI.animation.play("earth_equipped");
                            break;
                        case 2:
                            this.elementGUI.animation.play("wind_equipped");
                            break;
                        case 3:
                            this.elementGUI.animation.play("water_equipped");
                            break;
                        case 4:
                            this.elementGUI.animation.play("fire_equipped");
                            break;
                        case 5:
                            this.elementGUI.animation.play("ice_equipped");
                            break;
                    }
                    
            }
        }
    };

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: Player_enums) : void {
        var Vel = new Vec2(0,0); // velocity of sprite (if we make moving rock soothly.)
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        switch(direction){
            case Player_enums.FACING_UP:
                switch(target.imageId){
                    case "rock_P":
                    case "rock_S":
                        if(dest.y-1<2 || this.gameboard[dest.x][dest.y-1] != null) break;
                        dest.y--;
                    case "rock_M":
                        if(dest.y-1<2 || this.gameboard[dest.x][dest.y-1] != null) break;
                        dest.y--;
                    case "rock_L":
                        if(dest.y-1<2 || this.gameboard[dest.x][dest.y-1] != null) break;
                        dest.y--;
                        break;
                }
                break;
            case Player_enums.FACING_DOWN:
                switch(target.imageId){
                    case "rock_P":
                    case "rock_S":
                        if(dest.y+1>17 || this.gameboard[dest.x][dest.y+1] != null) break;
                        dest.y++;
                    case "rock_M":
                        if(dest.y+1>17 || this.gameboard[dest.x][dest.y+1] != null) break;
                        dest.y++;
                    case "rock_L":
                        if(dest.y+1>17 || this.gameboard[dest.x][dest.y+1] != null) break;
                        dest.y++;
                        break;
                }
                break;
            case Player_enums.FACING_LEFT:
                switch(target.imageId){
                    case "rock_P":
                    case "rock_S":
                        if(dest.x-1<2 || this.gameboard[dest.x-1][dest.y] != null) break;
                        dest.x--;
                    case "rock_M":
                        if(dest.x-1<2 || this.gameboard[dest.x-1][dest.y] != null) break;
                        dest.x--;
                    case "rock_L":
                        if(dest.x-1<2 || this.gameboard[dest.x-1][dest.y] != null) break;
                        dest.x--;
                        break;
                }
                break;
            case Player_enums.FACING_RIGHT:
                switch(target.imageId){
                    case "rock_P":
                    case "rock_S":
                        if(dest.x+1>17 || this.gameboard[dest.x+1][dest.y] != null) break;
                        dest.x++;
                    case "rock_M":
                        if(dest.x+1>17 || this.gameboard[dest.x+1][dest.y] != null) break;
                        dest.x++;
                    case "rock_L":
                        if(dest.x+1>17 || this.gameboard[dest.x+1][dest.y] != null) break;
                        dest.x++;
                        break;
                }
                break;
        }
        target.position.set(dest.x*16 + 8, dest.y*16 + 8);
        this.gameboard[targetposX][targetposY] = null;
        this.gameboard[dest.x][dest.y] = target;
    }


    // CTC TODO: if level-end portal is a sprite, then right here you could make this.portal (a Sprite field) and test this.player.position === this.portal.position to fire LEVEL_END event. In this case you could refer to the following to initialize the portal (add this code in its own function or maybe right at the end of initializePlayer function?):
        /*
        this.portal = this.add.sprite("portal", "primary"); **HAVE TO LOAD PORTAL AS IMAGE IN LOADSCENE FUNCTION
        this.player.position.set(3*16 + 8, 3*16 + 8); **CHANGE THE 3s TO BE SOME OTHER TILE POSITION
        this.portal.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.portal.addAI(ElementController, {});

        if the sprite is animated then you're on your own tbh lol, this should work for a non-animated sprite i hope
        */


    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16 + 8, 3*16 + 8);
        // CTC TODO: remove this todo, just note that i did not include player sprite in the gameboard array because thats too much work to update it lol
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.player.addAI(PlayerController, {tilemap: "Main"});
    }

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