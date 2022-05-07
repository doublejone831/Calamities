import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../Player/PlayerController";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "./CTCEvent";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";
import Input from "../../Wolfie2D/Input/Input";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AirstreamController from "../Element/AirstreamController";

export default class BaseStage extends Scene {
    // Pausing
    static paused: Boolean;
    private pauseGUI: Layer;
    private pauseMenuControls: Layer;
    private pauseReceiver: Receiver;
    // Map
    protected gameboard: Array<Array<Sprite>>;
    protected overlap: Array<Array<Sprite>>;
    endposition: Vec2;
    // Player
    player: AnimatedSprite;
    skillUsed: Array<boolean>;
    elementSelected: number;
    inAir: boolean = false;
    block: Sprite;
    savedNum: number;
    savedVec: Vec2;
    player_shield: Sprite = null;
    // GUI
    elementGUI: AnimatedSprite;
    // Viewport
    private viewportSize: number = 320;
    private num_col: number = 20;
    private num_row: number = 20;
    boss: AnimatedSprite = null;

    startScene(){
        // Set the viewport
        this.viewport.setBounds(0, 0, this.viewportSize, this.viewportSize);
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(2.5);

        // Initialize an empty gamebaord
        this.block = new Sprite("block");
        this.gameboard = new Array(this.num_col);
        this.overlap = new Array(this.num_col);
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
            this.overlap[i] = new Array(this.num_row).fill(null);
        }

        // Create primary layer
        this.addLayer("primary", 10);
        // Create second layer
        this.addLayer("sky", 15);
        this.elementGUI = this.add.animatedSprite("element_equipped", "sky");
        this.elementGUI.animation.play("none_equipped");
        this.elementGUI.position.set(3*16+6, 19*16);

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
        this.savedVec = null;

        // Receivers
        this.receiver.subscribe([
                                CTCevent.INTERACT_ELEMENT, 
                                CTCevent.PLACE_ELEMENT,
                                CTCevent.PLAYER_MOVE_REQUEST,
                                CTCevent.CHANGE_ELEMENT,
                                CTCevent.TORNADO_MOVE_REQUEST,
                                CTCevent.AIRSTREAM_EXTEND ]);
        this.pauseReceiver = new Receiver();
        this.pauseReceiver.subscribe([
                                    CTCevent.CONTROLS_POPUP,
                                    CTCevent.BACK_TO_MENU,
                                    CTCevent.RESTART_STAGE,
                                    CTCevent.TOGGLE_PAUSE ]);
    }

    updateScene(deltaT: number): void{
        // pausing and resuming
        this.check_paused();
        if(BaseStage.paused) return;
        // player info per frame
        let player_controller = (<PlayerController>this.player._ai);
        let dirVec = player_controller.dirUnitVector();
        let playerPosInBoard = this.sprite_pos_to_board_pos(this.player.position.x, this.player.position.y);
        // listen to events
        this.check_events(dirVec);
        this.check_current_tile(playerPosInBoard, dirVec);
    }

    check_paused(){
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
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.viewport.setZoomLevel(1);
                    this.sceneManager.changeToScene(MainMenu, {});                    
                    break;
                case CTCevent.RESTART_STAGE:
                    if(BaseStage.paused) this.restartStage();
                    break;
                case CTCevent.CONTROLS_POPUP:
                    this.pauseMenuControls.setHidden(!this.pauseMenuControls.isHidden());
                    break;
            }
        }
    }

    pauseAnimations(): void {
        this.player.animation.pause();
        if (this.boss) this.boss.animation.pause();
        for (let i = 2; i < this.gameboard.length-2; i++) {
            for (let j = 2; j < this.gameboard[i].length-2; j++) {
                if (this.gameboard[i][j]) {
                    switch(this.gameboard[i][j].imageId){
                        case "tornado":
                        case "airstream":
                        case "whirlwind":
                        case "ember":
                            (<AnimatedSprite>this.gameboard[i][j]).animation.pause();
                    }
                }
                if (this.overlap[i][j]) (<AnimatedSprite>this.overlap[i][j]).animation.pause();
            }
        }
    }

    resumeAnimations(): void {
        this.player.animation.resume();
        if (this.boss) this.boss.animation.resume();
        for (let i = 2; i < this.gameboard.length-2; i++) {
            for (let j = 2; j < this.gameboard[i].length-2; j++) {
                if (this.gameboard[i][j]) {
                    switch(this.gameboard[i][j].imageId){
                        case "tornado":
                        case "airstream":
                        case "whirlwind":
                        case "ember":
                            (<AnimatedSprite>this.gameboard[i][j]).animation.resume();
                    }
                }
                if (this.overlap[i][j]) (<AnimatedSprite>this.overlap[i][j]).animation.resume();
            }
        }
    }
    
    restartStage(): void {
        // Replace BaseStage to appropiate stage in child class
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(BaseStage, {});
    }

    nextStage(): void {
        // Replace BaseStage to appropiate stage in child class
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(BaseStage, {});
    }

    check_events(dirVec: Vec2){
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
                                this.emitter.fireEvent(CTCevent.PLAYER_MOVE, {"next_pos": next});
                        }
                    } else {
                        this.emitter.fireEvent(CTCevent.PLAYER_MOVE, {"next_pos": next});
                    }
                    break;
                case CTCevent.TORNADO_MOVE_REQUEST:
                    let whirlwind = event.data.get("sprite");
                    let old_pos = event.data.get("old");
                    let new_pos = event.data.get("new");
                    if(this.gameboard[new_pos.x][new_pos.y]) {
                        switch(this.gameboard[new_pos.x][new_pos.y].imageId) {
                            case "rock_S":
                            case "rock_M":
                            case "rock_L":
                            case "rock_P":
                                this.emitter.fireEvent(CTCevent.TORNADO_BLOCKED, {'id': whirlwind.id});
                                break;
                            default: // everything destroyed by tornado
                                if(this.gameboard[new_pos.x][new_pos.y]) this.gameboard[new_pos.x][new_pos.y].destroy();
                                this.gameboard[new_pos.x][new_pos.y] = whirlwind;
                                this.gameboard[old_pos.x][old_pos.y] = null;
                                whirlwind.position.set(new_pos.x*16+8, new_pos.y*16+8);
                                
                        }
                    } else {
                        this.gameboard[new_pos.x][new_pos.y] = whirlwind;
                        this.gameboard[old_pos.x][old_pos.y] = null;
                        whirlwind.position.set(new_pos.x*16+8, new_pos.y*16+8);
                    }
                    break;
                case CTCevent.AIRSTREAM_EXTEND:
                    let start = event.data.get("start");
                    let airstream = event.data.get("sprite");
                    let size = event.data.get("size");
                    let dir = event.data.get("dir");
                    let new_size = size;
                    let removing = false;
                    for(var i = 0; i<size; i++){
                        let air_pos = new Vec2(start.x, start.y);
                        air_pos.add(dir.scaled(i));
                        if(removing) {
                            if(this.overlap[air_pos.x][air_pos.y]) {
                                let remove = this.overlap[air_pos.x][air_pos.y];
                                remove.destroy();
                                this.overlap[air_pos.x][air_pos.y] = null;
                            }
                        } else if(this.gameboard[air_pos.x][air_pos.y]) {
                            switch(this.gameboard[air_pos.x][air_pos.y].imageId) {
                                case "rock_S":
                                case "rock_M":
                                case "rock_L":
                                case "rock_P":
                                case "block":
                                case "ice_cube":
                                    if(this.overlap[air_pos.x][air_pos.y]) {
                                        let remove = this.overlap[air_pos.x][air_pos.y];
                                        remove.destroy();
                                        this.overlap[air_pos.x][air_pos.y] = null;
                                    }
                                    new_size = i+1;
                                    removing = true;
                                    break;
                                default:
                                    if(this.overlap[air_pos.x][air_pos.y] == null) {
                                        let stream = this.add.animatedSprite("airstream", "sky");
                                        stream.position.set(air_pos.x*16+8, air_pos.y*16+8);
                                        stream.rotation = airstream.rotation;
                                        stream.animation.play("stream");
                                        this.overlap[air_pos.x][air_pos.y] = stream;
                                    }
                                    break;
                            }
                        } else {
                            if(this.overlap[air_pos.x][air_pos.y] == null) {
                                let stream = this.add.animatedSprite("airstream", "sky");
                                stream.position.set(air_pos.x*16+8, air_pos.y*16+8);
                                stream.rotation = airstream.rotation;
                                stream.animation.play("stream");
                                this.overlap[air_pos.x][air_pos.y] = stream;
                            }
                        }
                    }
                    if(new_size == size) {
                        if(removing) { // blocked by same block
                            this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": airstream.id, "blocked": true, "new_size": size});
                        } else { // not blocked anymore
                            this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": airstream.id, "blocked": false});
                        }
                    } else { // blocked by new block
                        this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": airstream.id, "blocked": true, "new_size": new_size});
                    }     
            }    
        }
    }

    activateElement(target: Sprite, targetposX: number, targetposY: number, direction: Vec2) : void {
        var dest = new Vec2(targetposX, targetposY);
        var dir = direction;
        let player_controller = (<PlayerController>this.player._ai);
        player_controller.cast_animation();
        switch(target.imageId){
            case "rock_S":
                if(this.elementSelected>1) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    switch(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId){
                        case "boss_block":
                            this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        case "hole":
                            this.gameboard[targetposX][targetposY] = null;
                            target.destroy();
                            break;
                        case "bubble":
                        case "ember":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
                            break;
                        case "deep_water":
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            break;
                        case "shallow_water":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
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
                if(this.gameboard[targetposX][targetposY] == null) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    switch(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId){
                        case "boss_block":
                            this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        case "hole":
                            this.gameboard[targetposX][targetposY] = null;
                            target.destroy();
                            break;
                        case "bubble":
                        case "ember":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
                            break;
                        case "deep_water":
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            break;
                        case "shallow_water":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
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
                if(this.gameboard[targetposX][targetposY] == null) break;
                if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                if(this.gameboard[dest.x+dir.x][dest.y+dir.y] != null){
                    switch(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId){
                        case "boss_block":
                            this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                        case "hole":
                            this.gameboard[targetposX][targetposY] = null;
                            target.destroy();
                            break;
                        case "bubble":
                        case "ember":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
                            break;
                        case "deep_water":
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            break;
                        case "shallow_water":
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
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
                switch(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId){
                    case "boss_block":
                        this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                    case "hole":
                        this.gameboard[targetposX][targetposY] = null;
                        target.destroy();
                        break;
                    case "bubble":
                    case "ember":
                        dest.add(dir);
                        this.gameboard[dest.x][dest.y].destroy();
                        target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                        this.gameboard[targetposX][targetposY] = null;
                        this.gameboard[dest.x][dest.y] = target;
                        targetposX = dest.x;
                        targetposY = dest.y;
                        break;
                    case "deep_water":
                        this.gameboard[targetposX][targetposY].destroy();
                        this.gameboard[targetposX][targetposY] = null;
                        dest.add(dir);
                        let deepWater = this.gameboard[dest.x][dest.y];
                        let shallowWater = this.add.sprite("shallow_water", "primary");
                        shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                        deepWater.destroy();
                        this.gameboard[dest.x][dest.y] = shallowWater;
                        break;
                    case "shallow_water":
                        dest.add(dir);
                        this.gameboard[dest.x][dest.y].destroy();
                        this.gameboard[dest.x][dest.y] = null;
                        this.gameboard[targetposX][targetposY].destroy();
                        this.gameboard[targetposX][targetposY] = null;
                        break;
                }
                break;
            case "whirlwind":
                if(this.elementSelected != 2) break;
                target.destroy();
                let stream = this.add.animatedSprite("airstream", "sky");
                stream.animation.play("stream");
                stream.position.set(targetposX*16+8, targetposY*16+8);
                if(dir.x == -1) {
                    stream.rotation = Math.PI;
                } else if(dir.y == 1) {
                    stream.rotation = 3*Math.PI/2;
                } else if(dir.y == -1) {
                    stream.rotation = Math.PI/2;
                }
                stream.alpha = 0;
                this.gameboard[targetposX][targetposY] = null;
                let stream_start = new Vec2(targetposX, targetposY);
                let stream_end = stream_start.clone().add(dir.scaled(4));
                stream.addAI(AirstreamController, {"start": stream_start, "end": stream_end, "size": 5});
                this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": stream.id, "blocked": false});
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
                player_controller.cast_animation();
                break;
            case 2:
                if (!player_controller.hasPower[1]) break;
                if(this.skillUsed[1]) break;
                this.skillUsed[1] = true;
                let place_wind = this.add.animatedSprite("whirlwind", "primary");
                place_wind.position.set(placeX*16 + 8, placeY*16 + 8);
                place_wind.animation.play("idle");
                this.gameboard[placeX][placeY] = place_wind;
                player_controller.cast_animation();
                break;
            case 3:
                if (!player_controller.hasPower[2]) break;
                if(this.skillUsed[2]) break;
                this.skillUsed[2] = true;
                let place_water = this.add.sprite("bubble", "primary");
                place_water.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_water;
                player_controller.cast_animation();
                break;
            case 4:
                if (!player_controller.hasPower[3]) break;
                if(this.skillUsed[3]) break;
                this.skillUsed[3] = true;
                let place_fire = this.add.animatedSprite("ember", "primary");
                place_fire.position.set(placeX*16 + 8, placeY*16 + 8);
                place_fire.animation.play("idle");
                this.gameboard[placeX][placeY] = place_fire;
                player_controller.cast_animation();
                break;
            case 5:
                if (!player_controller.hasPower[4]) break;
                if(this.skillUsed[4]) break;
                this.skillUsed[4] = true;
                let place_ice = this.add.sprite("ice_cube", "primary");
                place_ice.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_ice;
                player_controller.cast_animation();
                break;
        }
    }

    check_current_tile(pos: Vec2, dirVec: Vec2){
        let pCol = pos.x;
        let pRow = pos.y;
        if(!this.inAir) {
            if(this.overlap[pCol][pRow]) {
                this.inAir = true;
                switch(this.overlap[pCol][pRow].rotation){
                    case 0:
                        this.savedVec = new Vec2(1, 0);
                        break;
                    case Math.PI:
                        this.savedVec = new Vec2(-1, 0);
                        break;
                    case Math.PI/2:
                        this.savedVec = new Vec2(0, -1);
                        break;
                    case 3*Math.PI/2:
                        this.savedVec = new Vec2(0, 1);
                        break;
                }
                this.airstream_fly(pCol, pRow);
            }
        }
        if(!this.inAir) {
            if(this.gameboard[pCol][pRow]){
                switch(this.gameboard[pCol][pRow].imageId){
                    case "tornado":
                    case "whirlwind":
                        this.savedNum = this.whirlwind_fly(pCol, pRow, dirVec);
                        break;
                    case "bubble":
                        this.bubble_shield(pCol, pRow);
                        break;
                    case "ember":
                        this.ember_extinguish(pCol, pRow);
                        break;
                    case "hole":
                        if(this.overlap[pCol][pRow] == null) {
                            Input.enableInput();
                            this.restartStage();
                        }
                }
            }
            if(this.endposition.equals(pos)){
                this.nextStage();
            }
        } else {
            if(this.savedNum>0) {
                this.emitter.fireEvent(CTCevent.FLY);
                this.savedNum--;
            } else if(this.savedVec != null){
                this.airstream_fly(pCol, pRow);
            } else {
                this.inAir = false;
                Input.enableInput();
            }
        }
    }

    whirlwind_fly(posX: number, posY: number, dirVec: Vec2){
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

    airstream_fly(posX: number, posY: number) {
        Input.disableInput();
        let nextX = posX+this.savedVec.x;
        let nextY = posY+this.savedVec.y;
        if(this.overlap[nextX][nextY]) {
            this.player.position.set(nextX*16+8, nextY*16+8);
        } else {
            this.savedVec = null;
            Input.enableInput();
        }
    }

    bubble_shield(posX: number, posY: number){
        let bubble = this.gameboard[posX][posY];
        bubble.destroy();
        this.gameboard[posX][posY] = null;
        (<PlayerController>this.player._ai).gainShield(true);
        this.player_shield = new Sprite("shield");
        this.player_shield.position.set(posX*16+8, posY*16+8);
    }

    ember_extinguish(posX: number, posY: number){
        let ember = this.gameboard[posX][posY];
        ember.destroy();
        this.gameboard[posX][posY] = null;
        this.skillUsed[3] = false;
    }

    boss_dead(row: number, col: number, dead: Sprite = null) {
        if (dead) {
            if (this.gameboard[row][col]) this.gameboard[row][col].destroy();
            if (this.gameboard[row-1][col]) this.gameboard[row-1][col].destroy();
            if (this.gameboard[row][col-1]) this.gameboard[row][col-1].destroy();
            if (this.gameboard[row-1][col-1]) this.gameboard[row-1][col-1].destroy();
        }
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