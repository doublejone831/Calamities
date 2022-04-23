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

export default class BaseStage extends Scene {
    // Pausing
    static paused: Boolean;
    private pauseGUI: Layer;
    private pauseMenuControls: Layer;
    private pauseReceiver: Receiver;
    // Map
    private walls: OrthogonalTilemap;
    protected gameboard: Array<Array<Sprite>>;
    protected endposition: Vec2;
    // Player
    player: AnimatedSprite;
    skillUsed: Array<boolean>;
    elementSelected: number;
    inAir: boolean;
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
        this.gameboard = new Array(this.num_col);
        for (var i = 0; i < this.num_col; i++) {
            this.gameboard[i] = new Array(this.num_row).fill(null);
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
                                 // CTC TODO: subscribe to CTCevent.LEVEL_END event
                                ]);
        this.pauseReceiver = new Receiver();
        this.pauseReceiver.subscribe([
                                CTCevent.CONTROLS_POPUP,
                                CTCevent.BACK_TO_MENU,
                                CTCevent.RESTART_STAGE,
                                CTCevent.TOGGLE_PAUSE
        ]);
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
    
    restartStage() {
        // Change BaseStage to appropiate stage
        this.sceneManager.changeToScene(BaseStage, {});
    }

    pushRock(target: Sprite, targetposX: number, targetposY: number, direction: number) : void {
        var Vel = new Vec2(0,0); // velocity of sprite (if we make moving rock soothly.)
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        var dir;
        switch(direction){
            case 0:
                dir = new Vec2(0, -1);
                break;
            case 1:
                dir = new Vec2(-1, 0);
                break;
            case 2:
                dir = new Vec2(0, 1);
                break;
            case 3:
                dir = new Vec2(1, 0);
                break;
        }
        switch(target.imageId){
            case "rock_P":
            case "rock_S":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 ||this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                targetposX = dest.x;
                targetposY = dest.y;
            case "rock_M":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                targetposX = dest.x;
                targetposY = dest.y;
            case "rock_L":
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                break;
        }
    }

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: number) : void {
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        var dir;
        var scaling = 1;
        switch(direction){
            case 0:
                dir = new Vec2(0, -1);
                break;
            case 1:
                dir = new Vec2(-1, 0);
                break;
            case 2:
                dir = new Vec2(0, 1);
                break;
            case 3:
                dir = new Vec2(1, 0);
                break;
        }
        let player_controller = (<PlayerController>this.player._ai);
        player_controller.cast_animation();
        switch(target.imageId){
            case "rock_S":
                if(this.elementSelected!=1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 ||this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                targetposX = dest.x;
                targetposY = dest.y;
            case "rock_M":
                if(this.elementSelected!=1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                targetposX = dest.x;
                targetposY = dest.y;
            case "rock_L":
                if(this.elementSelected!=1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17 || this.gameboard[dest.x+dir.x][dest.y+dir.y] != null) break;
                dest.add(dir);
                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                break;
            case "rock_P":
                if(this.elementSelected != 1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                while(this.gameboard[dest.x+dir.x][dest.y+dir.y] == null) {
                    dest.add(dir);
                    target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                    this.gameboard[dest.x][dest.y] = target;
                    this.gameboard[targetposX][targetposY] = null;
                    targetposX = dest.x;
                    targetposY = dest.y;
                    if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
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
                break;
            case "ember":
                if(this.elementSelected != 4) break;
                break;
            case "ice_cube":
                if(this.elementSelected != 5) break;
                break;
        }
    }

    place_element(placeX: number, placeY: number, type: number){
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

    whirlwind_fly(posX: number, posY: number){
        let wind = this.gameboard[posX][posY];
        wind.destroy();
        this.gameboard[posX][posY] = null;
        this.skillUsed[1] = false;
        this.inAir = true;
        (<PlayerController>this.player._ai).takeFlight();
    //    this.emitter.fireEvent(CTCevent.FLY, {"clear": false});
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

    // position in pixels to position to row col
    sprite_pos_to_board_pos(posX: number, posY: number){
        return new Vec2((posX-8)/16, (posY-8)/16);
    }

    // position in row col to pixels
    board_pos_to_sprite_pos(posX: number, posY: number){
        return new Vec2(16*posX+8, 16*posY+8);
    }
}