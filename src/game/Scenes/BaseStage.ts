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
import { Player_enums } from "../Player/Player_enums";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";

export default class BaseStage extends Scene {
    // Pausing
    static paused: Boolean;
    private pauseGUI: Layer;
    private pauseReceiver: Receiver;
    // Map
    private walls: OrthogonalTilemap;
    protected gameboard: Array<Array<Sprite>>;
    protected endposition: Vec2;
    // Player
    player: AnimatedSprite;
    skillUsed: Array<boolean>;
    elementSelected: number;
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
                                CTCevent.BACK_TO_MENU,
                                CTCevent.RESTART_STAGE,
                                CTCevent.TOGGLE_PAUSE
        ]);
       
        // Initialize player
        this.initializePlayer();
        this.elementSelected = 0;
    }

    updateScene(deltaT: number): void{
        //pausing and resuming
        while(this.pauseReceiver.hasNextEvent()){
            let event = this.pauseReceiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    if(!BaseStage.paused) {
                        this.pauseGUI.setHidden(false);
                        this.pauseAnimations();
                        this.receiver.ignoreEvents();
                    } else {
                        this.pauseGUI.setHidden(true);
                        this.resumeAnimations();
                    }
                    BaseStage.paused = !BaseStage.paused;
                    break;
                case CTCevent.BACK_TO_MENU:
                    if(BaseStage.paused) {
                        this.viewport.setZoomLevel(1);
                        //MainMenu.unlocked[0] = true;        //unlock level test
                        this.sceneManager.changeToScene(MainMenu, {});
                    }
                    break;
                case CTCevent.RESTART_STAGE:
                    if(BaseStage.paused) this.restartStage();
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

    pushRock(target: Sprite, targetposX: number, targetposY: number, direction: Player_enums) : void {
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

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: Player_enums) : void {
        var Vel = new Vec2(0,0); // velocity of sprite (if we make moving rock soothly.)
        var dest = new Vec2(targetposX, targetposY); //destination that rock will go. (Index)
        var dir;
        var scaling = 1;
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
            case "rock_M":
            case "rock_L":
                if(this.elementSelected == 0) this.pushRock(target, targetposX, targetposY, direction);
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
                if(this.elementSelected != 2) break;
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                scaling = 3;
                dest.add(dir.scaled(2));
                for(var i = 0; i<2; i++){
                    if(dest.x>=2 && dest.y>=2 && dest.x<=17 && dest.y<=17 && this.gameboard[dest.x][dest.y] == null) break;    
                    dest.sub(dir);
                    scaling--;
                    
                }
                this.player.position.set(dest.x*16+8, dest.y*16+8);
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

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(0, 0);
        // CTC TODO: remove this todo, just note that i did not include player sprite in the gameboard array because thats too much work to update it lol
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.player.addAI(PlayerController, {tilemap: "Main"});
        this.skillUsed = new Array(5).fill(false);
    }
}