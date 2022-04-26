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
import { CTCevent } from "./CTCEvent";
import ElementController from "../Element/ElementController";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";
import Input from "../../Wolfie2D/Input/Input";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class BaseStage extends Scene {
    // Pausing
    static paused: Boolean;
    private pauseGUI: Layer;
    private pauseMenuControls: Layer;
    private pauseReceiver: Receiver;
    // Map
    private walls: OrthogonalTilemap;
    protected gameboard: Array<Array<Sprite>>;
    endposition: Vec2;
    // Player
    player: AnimatedSprite;
    skillUsed: Array<boolean>;
    elementSelected: number;
    inAir: boolean = false;
    block: Sprite;
    savedNum: number;
    // GUI
    elementGUI: AnimatedSprite;
    // Viewport
    private viewportSize: number = 320;
    private num_col: number = 20;
    private num_row: number = 20;

    startScene(){
        // Set the viewport
        this.viewport.setBounds(0, 0, this.viewportSize, this.viewportSize);
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(2.5);

        // Initialize an empty gamebaord
        this.block = new Sprite("block");
        this.gameboard = new Array(this.num_col);
        for (var i = 0; i < this.num_col; i++) {
            if(i<2 || i>17){
                this.gameboard[i] = new Array(this.num_row).fill(this.block);
            } else {
                let arr = new Array(this.num_row).fill(null, 1, 18);
                arr[0] = this.block;
                arr[1] = this.block;
                arr[18] = this.block;
                arr[19] = this.block;
                this.gameboard[i] = arr;
            }
        }

        // Create primary layer
        this.addLayer("primary", 10);
        this.elementGUI = this.add.animatedSprite("element_equipped", "primary");
        this.elementGUI.animation.play("none_equipped");
        this.elementGUI.position.set(3*16+4, 19*16);

        // Add pause gui
        this.pauseGUI = this.addUILayer("pauseMenu");
        this.pauseGUI.setHidden(true);
        let pauseText = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(3*16, 16), text: "GAME PAUSED"});
        pauseText.textColor = Color.WHITE;

        const pauseControlsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(17*16, 15*16), text: "Controls"});
        pauseControlsLabel.size.set(200, 50);
        pauseControlsLabel.borderWidth = 2;
        pauseControlsLabel.borderColor = Color.BLACK;
        pauseControlsLabel.backgroundColor = new Color(0,255,213);
        pauseControlsLabel.textColor = Color.BLACK;

        const pauseControlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(17*16, 15*16), text: ""});
        pauseControlsButton.backgroundColor = new Color(0,0,0,0);
        pauseControlsButton.borderColor = pauseControlsButton.backgroundColor;
        pauseControlsButton.size.set(200/2.5,50/2.5);
        pauseControlsButton.onClickEventId = "controls_popup";

        this.pauseMenuControls = this.addUILayer("pauseMenuControls");
        this.pauseMenuControls.setHidden(true);

        const pauseControlsBackground = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(7*16, 10*16), text: ""});
        pauseControlsBackground.backgroundColor = new Color(214,179,179,1);
        pauseControlsBackground.size.set(500,650);

        const pauseControlsL1 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y - 110), text: "Controls"});
        const pauseControlsL2 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y - 60), text: "W,A,S,D - Move Player"});
        const pauseControlsL3 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y - 30), text: "Q,E - Rotate Player"});
        const pauseControlsL4 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y), text: "1,2,3,4,5 - Switch Element"});
        const pauseControlsL5 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y + 30), text: "J - Interact With Element"});
        const pauseControlsL6 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y + 60), text: "K - Place/Remove Element"});
        const pauseControlsL7 = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenuControls", {position: new Vec2(pauseControlsBackground.position.x, pauseControlsBackground.position.y + 90), text: "ESC - Unpause"});

        const pauseMainMenuLabel = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(17*16, 19*16), text: "Main Menu"});
        pauseMainMenuLabel.size.set(200, 50);
        pauseMainMenuLabel.borderWidth = 2;
        pauseMainMenuLabel.borderColor = Color.BLACK;
        pauseMainMenuLabel.backgroundColor = new Color(0,255,213);
        pauseMainMenuLabel.textColor = Color.BLACK;

        const pauseMainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(17*16, 19*16), text: ""});
        pauseMainMenuButton.clone(pauseControlsButton, "back_to_menu", true);

        const pauseRestartLabel = <Label>this.add.uiElement(UIElementType.LABEL, "pauseMenu", {position: new Vec2(17*16, 17*16), text: "Restart Level"});
        pauseRestartLabel.size.set(200, 50);
        pauseRestartLabel.borderWidth = 2;
        pauseRestartLabel.borderColor = Color.BLACK;
        pauseRestartLabel.backgroundColor = new Color(0,255,213);
        pauseRestartLabel.textColor = Color.BLACK;

        const pauseRestartButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(17*16, 17*16), text: ""});
        pauseRestartButton.clone(pauseControlsButton, "restart", true);

        BaseStage.paused = false;

        // Receivers
        this.receiver.subscribe([
                                CTCevent.INTERACT_ELEMENT, 
                                CTCevent.PLACE_ELEMENT,
                                CTCevent.PLAYER_MOVE_REQUEST,
                                CTCevent.CHANGE_ELEMENT
                                ]);
        this.pauseReceiver = new Receiver();
        this.pauseReceiver.subscribe([
                                    CTCevent.CONTROLS_POPUP,
                                    CTCevent.BACK_TO_MENU,
                                    CTCevent.RESTART_STAGE,
                                    CTCevent.TOGGLE_PAUSE ]);
    }

    updateScene(deltaT: number): void{
        //pausing and resuming
        if(BaseStage.paused) this.receiver.ignoreEvents();
        while(this.pauseReceiver.hasNextEvent()){
            let event = this.pauseReceiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    if(!BaseStage.paused) {
                        this.pauseGUI.setHidden(false);
                        this.pauseAnimations(); 
                    } else {
                        this.pauseGUI.setHidden(true);
                        this.pauseMenuControls.setHidden(true);
                        this.resumeAnimations();
                    }
                    BaseStage.paused = !BaseStage.paused;
                    break;
                case CTCevent.BACK_TO_MENU:
                    console.log("BACK TO MENU");
                    if(BaseStage.paused) {
                        this.viewport.setZoomLevel(1);
                        //MainMenu.unlocked[0] = true;        //unlock level test
                        this.sceneManager.changeToScene(MainMenu, {});
                    }
                    break;
                case CTCevent.RESTART_STAGE:
                    if(BaseStage.paused) this.restartStage();
                    break;
                case CTCevent.CONTROLS_POPUP:
                    if(BaseStage.paused) {
                        this.pauseMenuControls.setHidden(!this.pauseMenuControls.isHidden());
                    }
                    break;
            }
        }
        let player_controller = (<PlayerController>this.player._ai);
        let dirVec = player_controller.dirUnitVector();
        let playerPosInBoard = this.sprite_pos_to_board_pos(this.player.position.x, this.player.position.y);
        let pRow = playerPosInBoard.x;
        let pCol = playerPosInBoard.y;
        if(!this.inAir) {
            if(this.gameboard[pRow][pCol]){
                switch(this.gameboard[pRow][pCol].imageId){
                    case "whirlwind":
                        this.savedNum = this.whirlwind_fly(pRow, pCol, dirVec);
                        break;
                    case "bubble":
                        this.bubble_shield(pRow, pCol);
                        break;
                    case "ember":
                        this.ember_extinguish(pRow, pCol);
                        break;
                }
            }
            if(this.endposition.equals(playerPosInBoard)){
                this.nextStage();
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
                            case "block":
                            case "boss_block":
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
    }

    pauseAnimations(): void {
        this.player.animation.pause();
        for (let i = 2; i < this.gameboard.length-2; i++) {
            for (let j = 2; j < this.gameboard[i].length-2; j++) {
                if (this.gameboard[i][j]) {
                    let id = this.gameboard[i][j].imageId;
                    if (id === "whirlwind" || id === "ember") (<AnimatedSprite>this.gameboard[i][j]).animation.pause();
                }
            }
        }
    }

    resumeAnimations(): void {
        this.player.animation.resume();
        for (let i = 2; i < this.gameboard.length-2; i++) {
            for (let j = 2; j < this.gameboard[i].length-2; j++) {
                if (this.gameboard[i][j]) {
                    let id = this.gameboard[i][j].imageId;
                    if (id === "whirlwind" || id === "ember") (<AnimatedSprite>this.gameboard[i][j]).animation.resume();
                }
            }
        }
    }
    
    restartStage(): void {
        // Replace BaseStage to appropiate stage
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(BaseStage, {});
    }

    nextStage(): void {
        // Replace BaseStage to appropiate stage
        this.sceneManager.changeToScene(BaseStage, {});
    }

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: Vec2) : void {
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        var dir = direction;
        let player_controller = (<PlayerController>this.player._ai);
        player_controller.cast_animation();
        switch(target.imageId){
            case "rock_S":
                if(this.elementSelected>1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    if(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId == "boss_block") {
                        this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        this.gameboard[targetposX][targetposY] = null;
                        target.destroy();
                        break;
                    } else {
                        break;
                    }
                } else {
                    dest.add(dir);
                    target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                    this.gameboard[targetposX][targetposY] = null;
                    this.gameboard[dest.x][dest.y] = target;
                    targetposX = dest.x;
                    targetposY = dest.y;
                }
            case "rock_M":
                if(this.elementSelected>1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    if(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId == "boss_block") {
                        this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        this.gameboard[targetposX][targetposY] = null;
                        target.destroy();
                        break;
                    } else {
                        break;
                    }
                } else {
                    dest.add(dir);
                    target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                    this.gameboard[targetposX][targetposY] = null;
                    this.gameboard[dest.x][dest.y] = target;
                    targetposX = dest.x;
                    targetposY = dest.y;
                }
            case "rock_L":
                if(this.elementSelected>1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    if(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId == "boss_block") {
                        this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        this.gameboard[targetposX][targetposY] = null;
                        target.destroy();
                        break;
                    } else {
                        break;
                    }
                } else {
                    dest.add(dir);
                    target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                    this.gameboard[targetposX][targetposY] = null;
                    this.gameboard[dest.x][dest.y] = target;
                    targetposX = dest.x;
                    targetposY = dest.y;
                }
                break;
            case "rock_P":
                if(this.elementSelected != 1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                while(this.gameboard[dest.x+dir.x][dest.y+dir.y] == null) {
                    dest.add(dir);
                    target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                    this.gameboard[dest.x][dest.y] = target;
                    this.gameboard[targetposX][targetposY] = null;
                    targetposX = dest.x;
                    targetposY = dest.y;
                    if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                }
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId == "boss_block") {
                    this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                    this.gameboard[targetposX][targetposY] = null;
                    target.destroy();
                }
                break;
            case "whirlwind":
                if(this.elementSelected != 2) break;
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                break;
            case "bubble":
                if(this.elementSelected != 3) break;
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                break;
            case "ember":
                if(this.elementSelected != 4) break;
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                break;
            case "ice_cube":
                if(this.elementSelected != 5) break;
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                break;
        }
    }

    place_element(placeX: number, placeY: number, type: number): void {
        let player_controller = (<PlayerController>this.player._ai);
        switch(type) {
            case 1:
                if (!player_controller.hasPower[0]) break;
                if(this.skillUsed[0]) break;
                this.skillUsed[0] = true;
                let place_rock = this.add.sprite("rock_P", "primary");
                place_rock.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_rock;
                break;
            case 2:
                if (!player_controller.hasPower[1]) break;
                if(this.skillUsed[1]) break;
                this.skillUsed[1] = true;
                let place_wind = this.add.animatedSprite("whirlwind", "primary");
                place_wind.position.set(placeX*16 + 8, placeY*16 + 8);
                place_wind.animation.play("idle");
                this.gameboard[placeX][placeY] = place_wind;
                break;
            case 3:
                if (!player_controller.hasPower[2]) break;
                if(this.skillUsed[2]) break;
                this.skillUsed[2] = true;
                let place_water = this.add.sprite("bubble", "primary");
                place_water.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_water;
                break;
            case 4:
                if (!player_controller.hasPower[3]) break;
                if(this.skillUsed[3]) break;
                this.skillUsed[3] = true;
                let place_fire = this.add.animatedSprite("ember", "primary");
                place_fire.position.set(placeX*16 + 8, placeY*16 + 8);
                place_fire.animation.play("idle");
                this.gameboard[placeX][placeY] = place_fire;
                break;
            case 5:
                if (!player_controller.hasPower[4]) break;
                if(this.skillUsed[4]) break;
                this.skillUsed[4] = true;
                let place_ice = this.add.sprite("ice_cube", "primary");
                place_ice.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_ice;
                break;
        }
    }

    whirlwind_fly(posX: number, posY: number, dirVec: Vec2){
        let wind = this.gameboard[posX][posY];
        wind.destroy();
        this.gameboard[posX][posY] = null;
        this.skillUsed[1] = false;
        this.inAir = true;
        Input.disableInput();
        var jumps = 0;
        for(var i = 1; i<3; i++) {
            if(this.gameboard[posX+dirVec.scaled(i).x][posY+dirVec.scaled(i).y]){
                switch(this.gameboard[posX+dirVec.scaled(i).x][posY+dirVec.scaled(i).y].imageId){
                    case "rock_P":
                    case "rock_S":
                    case "rock_M":
                    case "rock_L":
                    case "ice_cube":
                    case "block":
                    case "boss_block":
                        break;
                    default:
                        jumps = i;
                }
            } else {
                jumps = i;
            }
        }
        return jumps;
    }

    bubble_shield(posX: number, posY: number){
        let bubble = this.gameboard[posX][posY];
        bubble.destroy();
        this.gameboard[posX][posY] = null;
        (<PlayerController>this.player._ai).gainShield(true);
        this.skillUsed[2] = false;
    }

    ember_extinguish(posX: number, posY: number){
        let ember = this.gameboard[posX][posY];
        ember.destroy();
        this.gameboard[posX][posY] = null;
        this.skillUsed[3] = false;
    }

    boss_dead(row: number, col: number, dead: Sprite = null) {
        this.gameboard[row][col] = dead;
        this.gameboard[row-1][col] = dead;
        this.gameboard[row][col-1] = dead;
        this.gameboard[row-1][col-1] = dead;
    }

    // position in pixels to position to row col
    sprite_pos_to_board_pos(posX: number, posY: number){
        return new Vec2((posX-8)/16, (posY-8)/16);
    }

    // position in row col to pixels
    board_pos_to_sprite_pos(posX: number, posY: number){
        return new Vec2(16*posX+8, 16*posY+8);
    }
}