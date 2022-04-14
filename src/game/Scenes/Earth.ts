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
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";

export default class Earth extends Scene {
    static paused: Boolean;
    static justPaused: Boolean;
    static justResumed: Boolean;
    private walls: OrthogonalTilemap;
    private player: AnimatedSprite;
    protected gameboard : Array<Array<Sprite>>;
    protected endposition : Vec2;
    private skillUsed : Array<Boolean>;
    private elementGUI : AnimatedSprite;
    private pauseGUI: Layer;
    private pauseReceiver: Receiver;

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

        this.pauseGUI = this.addUILayer("pauseMenu");
        this.pauseGUI.setHidden(true);
        let pauseText = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(3*16, 16), text: "GAME PAUSED"});
        pauseText.textColor = Color.WHITE;

        const pauseMainMenuLabel = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(17*16, 19*16), text: "Main Menu"});
        pauseMainMenuLabel.size.set(200, 50);
        pauseMainMenuLabel.borderWidth = 2;
        pauseMainMenuLabel.borderColor = Color.BLACK;
        pauseMainMenuLabel.backgroundColor = new Color(0,255,213);
        pauseMainMenuLabel.textColor = Color.BLACK;

        const pauseMainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(17*16, 19*16), text: ""});
        pauseMainMenuButton.backgroundColor = new Color(0,0,0,0);
        pauseMainMenuButton.borderColor = pauseMainMenuButton.backgroundColor;
        pauseMainMenuButton.size.set(200/2.5,50/2.5);
        pauseMainMenuButton.onClickEventId = "backToMenu";

        const pauseRestartLabel = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(17*16, 17*16), text: "Restart Level"});
        pauseRestartLabel.size.set(200, 50);
        pauseRestartLabel.borderWidth = 2;
        pauseRestartLabel.borderColor = Color.BLACK;
        pauseRestartLabel.backgroundColor = new Color(0,255,213);
        pauseRestartLabel.textColor = Color.BLACK;

        const pauseRestartButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(17*16, 17*16), text: ""});
        pauseRestartButton.clone(pauseMainMenuButton, "restart", true);

        this.initializeGameboard();
        
        this.initializePlayer();

        this.skillUsed = [false, false, false, false, false];
        Earth.paused = false;
        Earth.justPaused = false;
        Earth.justResumed = false;

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
        this.pauseReceiver = new Receiver();
        this.pauseReceiver.subscribe("backToMenu");
        this.pauseReceiver.subscribe("restart");
       
    }

    updateScene(){
        if (!Earth.paused) {
            this.pauseGUI.setHidden(true);
            if (Earth.justResumed) {
                Earth.justResumed = false;
                this.resumeAnimations();
            }
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
        }
        else {
            if (Earth.justPaused) {
                Earth.justPaused = false;
                this.pauseAnimations();
            }
            this.pauseGUI.setHidden(false);
            this.receiver.ignoreEvents();
            while(this.pauseReceiver.hasNextEvent()){
                let event = this.pauseReceiver.getNextEvent();

                switch(event.type){
                    case "backToMenu":
                        this.viewport.setZoomLevel(1);
                        //MainMenu.unlocked[0] = true;        //unlock level test
                        this.sceneManager.changeToScene(MainMenu, {});
                        break;
                    case "restart":
                        this.sceneManager.changeToScene(Earth, {});
                        break;
                }
            }
        }
    };

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: Player_enums) : void {
        var Vel = new Vec2(0,0); // velocity of sprite (if we make moving rock soothly.)
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        var dir;
        switch(direction){
            case Player_enums.FACING_UP:
                dir = new Vec2(0, -1);
                break;
            case Player_enums.FACING_DOWN:
                dir = new Vec2(0, 1);
                break;
            case Player_enums.FACING_LEFT:
                dir = new Vec2(-1, 0);
                break;
            case Player_enums.FACING_RIGHT:
                dir = new Vec2(1, 0);
                break;
        }
        switch(target.imageId){
            case "rock_P":
            case "rock_S":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 ||this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
            case "rock_M":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
            case "rock_L":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                break;
            case "whirlwind":
                /*
                this.player.tweens.add("fly", {
                    startDelay: 0,
                    duration: 500,
                    effects: [
                        {
                            property: this.player.position,
                            start: this.player.position,
                            end: dest,
                            ease: EaseFunctionType.IN_OUT_QUAD
                        }
                    ]
                });*/
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                if(dest.x+dir.scaled(3).x >= 2 && dest.y+dir.scaled(3).y >= 2 && dest.x+dir.scaled(3).x <= 17 && dest.y+dir.scaled(3).y <= 17) {
                    if (this.gameboard[dest.x+dir.scaled(3).x][dest.y+dir.scaled(3).y] == null) {
                        //dest.add(dir.scaled(3));
                        //this.player.tweens.play("fly");
                        for(var i = 0; i<3; i++) {
                            dest.add(dir);
                            this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next": dest});
                        }
                        
                    }
                } else if(dest.x+dir.scaled(2).x >= 2 && dest.y+dir.scaled(2).y >= 2 && dest.x+dir.scaled(2).x <= 17 && dest.y+dir.scaled(2).y <= 17) {
                    if (this.gameboard[dest.x+dir.scaled(2).x][dest.y+dir.scaled(2).y] == null) {
                        //dest.add(dir.scaled(2));
                        //this.player.tweens.play("fly");
                        for(var i = 0; i<2; i++) {
                            dest.add(dir);
                            this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next": dest});
                        }
                    }
                }
                break;
            case "bubble":
                break;
            case "ember":
                break;
            case "ice_cube":
                break;
        }
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

    pauseAnimations(): void {
        this.player.animation.pause();
        for (let i = 0; i < this.gameboard.length; i++) {
            for (let j = 0; j < this.gameboard[i].length; j++) {
                if (this.gameboard[i][j]) {
                    let id = this.gameboard[i][j].imageId;
                    if (id === "whirlwind" || id === "ember") (<AnimatedSprite>this.gameboard[i][j]).animation.pause();
                }
            }
        }
    }

    resumeAnimations(): void {
        this.player.animation.resume();
        for (let i = 0; i < this.gameboard.length; i++) {
            for (let j = 0; j < this.gameboard[i].length; j++) {
                if (this.gameboard[i][j]) {
                    let id = this.gameboard[i][j].imageId;
                    if (id === "whirlwind" || id === "ember") (<AnimatedSprite>this.gameboard[i][j]).animation.resume();
                }
            }
        }
    }
}