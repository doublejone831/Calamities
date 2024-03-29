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
import WaveController from "../Element/WaveController";
import IgniteController from "../Element/IgniteController";
import FlamesController from "../Element/FlamesController";
import { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";

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
    savedNum: number;
    savedVec: Vec2;
    player_shield: Sprite = null;
    player_moving: boolean;
    // GUI
    elementGUI: AnimatedSprite;
    // Viewport
    private viewportSize: number = 320;
    private num_col: number = 20;
    private num_row: number = 20;
    boss: AnimatedSprite = null;

    startScene(){
        Input.enableInput();
        // Set the viewport
        this.viewport.setBounds(0, 0, this.viewportSize, this.viewportSize);
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(2.5);

        // Initialize an empty gamebaord
        let out = new Sprite("outofbounds");
        this.gameboard = new Array(this.num_col);
        this.overlap = new Array(this.num_col);
        for (var i = 0; i < this.num_col; i++) {
            if(i<2 || i>17){
                this.gameboard[i] = new Array(this.num_row).fill(out);
            } else {
                let arr = new Array(this.num_row).fill(null, 1, 18);
                arr[0] = out;
                arr[1] = out;
                arr[18] = out;
                arr[19] = out;
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
        this.player_moving = false;

        // Receivers
        this.receiver.subscribe([
                                CTCevent.INTERACT_ELEMENT, 
                                CTCevent.PLACE_ELEMENT,
                                CTCevent.PLAYER_MOVE_REQUEST,
                                CTCevent.CHANGE_ELEMENT,
                                CTCevent.DESTROY_ELEMENT,
                                CTCevent.TORNADO_MOVE_REQUEST,
                                CTCevent.AIRSTREAM_EXTEND,
                                CTCevent.WAVE_SPLASH,
                                CTCevent.FLAMES_GROW,
                                CTCevent.IGNITE_BURN ]);
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
        this.player_moving = false;
    }

    check_paused(){
        while(this.pauseReceiver.hasNextEvent()){
            let event = this.pauseReceiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    if(!BaseStage.paused) {
                        this.emitter.fireEvent(GameEventType.MUTE_CHANNEL, {channel: AudioChannelType.SFX});
                        this.emitter.fireEvent(GameEventType.MUTE_CHANNEL, {channel: AudioChannelType.MUSIC});
                        this.pauseGUI.setHidden(false);
                        this.pauseAnimations(); 
                    } else {
                        this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.SFX});
                        this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.MUSIC});
                        this.pauseGUI.setHidden(true);
                        this.pauseMenuControls.setHidden(true);
                        this.resumeAnimations();
                    }
                    BaseStage.paused = !BaseStage.paused;
                    break;
                case CTCevent.BACK_TO_MENU:
                    console.log("BACK TO MENU");
                    this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.SFX});
                    this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.MUSIC});
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.viewport.setZoomLevel(1);
                    this.sceneManager.changeToScene(MainMenu, {});                    
                    break;
                case CTCevent.RESTART_STAGE:
                    this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.SFX});
                    this.emitter.fireEvent(GameEventType.UNMUTE_CHANNEL, {channel: AudioChannelType.MUSIC});
                    this.restartStage();
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
                case CTCevent.DESTROY_ELEMENT:
                    var removal = event.data.get("target");
                    removal.destroy();
                    break;
                case CTCevent.PLAYER_MOVE_REQUEST:
                    if(this.inAir) break;
                    var next = event.data.get("next");
                    if(this.gameboard[next.x][next.y]){
                        switch(this.gameboard[next.x][next.y].imageId) {
                            case "rock_P":
                            case "rock_S":
                            case "rock_M":
                            case "rock_L":
                            case "deep_water":
                            case "torch":
                            case "ice_cube":
                            case "outofbounds":
                            case "wall":
                            case "boss_block":
                                break;
                            default:
                                this.player_moving = true;
                                this.player.position.set(next.x*16+8, next.y*16+8);
                        }
                    } else {
                        this.player_moving = true;
                        this.player.position.set(next.x*16+8, next.y*16+8);
                    }
                    this.emitter.fireEvent(CTCevent.PLAYER_MOVE);
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
                                case "wall":
                                case "outofbounds":
                                case "boss_block":
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
                    break;
                case CTCevent.WAVE_SPLASH:
                    let wave = event.data.get("sprite");
                    let wave_pos = this.sprite_pos_to_board_pos(wave.position.x, wave.position.y);
                    let wave_dir = event.data.get("dir");
                    if(this.gameboard[wave_pos.x+wave_dir.x][wave_pos.y+wave_dir.y]) {
                        switch(this.gameboard[wave_pos.x+wave_dir.x][wave_pos.y+wave_dir.y].imageId) {
                            case "boss_block":
                                // damage fire boss
                                wave.destroy();
                                break;
                            case "torch":
                                (<AnimatedSprite>this.gameboard[wave_pos.x+wave_dir.x][wave_pos.y+wave_dir.y]).animation.play("off");
                            case "hole":
                            case "rock_S":
                            case "rock_M":
                            case "rock_L":
                            case "rock_P":
                            case "wall":
                            case "outofbounds":
                            case "ice_cube":
                            case "portal":
                                wave.destroy();
                                break;
                            case "ember":
                            case "flames":
                                this.gameboard[wave_pos.x+wave_dir.x][wave_pos.y+wave_dir.y].destroy();
                                this.gameboard[wave_pos.x+wave_dir.x][wave_pos.y+wave_dir.y] = null;
                            default:
                                wave_pos.add(wave_dir);
                                let new_wave = this.board_pos_to_sprite_pos(wave_pos.x, wave_pos.y);
                                wave.position.set(new_wave.x, new_wave.y);
                        }
                    } else {
                        wave_pos.add(wave_dir);
                        let new_wave = this.board_pos_to_sprite_pos(wave_pos.x, wave_pos.y);
                        wave.position.set(new_wave.x, new_wave.y);
                    }
                    break;
                case CTCevent.FLAMES_GROW:
                    let flames = event.data.get("sprite");
                    let firepower = event.data.get("level");
                    let flames_pos = this.sprite_pos_to_board_pos(flames.position.x, flames.position.y);
                    switch(firepower){
                        case -1: // blocked by rock
                            if(this.gameboard[flames_pos.x][flames_pos.y] == null){
                                flames.alpha = 1;
                                this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": 0});
                                this.gameboard[flames_pos.x][flames_pos.y] = flames;
                            }
                            break;
                        case 0: // grow to level 1
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": 1});
                            break;
                        case 1: // grow to level 2
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": 2});
                            break;
                        case 2: // grow to level 3
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": 3});
                            break;
                        case 3: // spread to nearby tiles
                            var new_flame;
                            if(this.gameboard[flames_pos.x+1][flames_pos.y] == null) {
                                new_flame = this.add.animatedSprite("flames", "primary");
                                new_flame.animation.play("level0");
                                new_flame.position.set((flames_pos.x+1)*16+8, flames_pos.y*16+8);
                                this.gameboard[flames_pos.x+1][flames_pos.y] = new_flame;
                                new_flame.addAI(FlamesController, {"level": 0});
                            } else {
                                switch(this.gameboard[flames_pos.x+1][flames_pos.y].imageId) {
                                    case "torch":
                                        let anime = (<AnimatedSprite>this.gameboard[flames_pos.x+1][flames_pos.y]);
                                        if(anime.animation.isPlaying("off")) {
                                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                                            anime.animation.play("on");
                                        }
                                        break;
                                    case "bubble":
                                            this.gameboard[flames_pos.x+1][flames_pos.y].destroy();
                                            this.gameboard[flames_pos.x+1][flames_pos.y] = null;
                                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "water"});
                                            break;
                                    case "ember":
                                        this.gameboard[flames_pos.x+1][flames_pos.y].destroy();
                                        new_flame = this.add.animatedSprite("flames", "primary");
                                        new_flame.animation.play("level1");
                                        new_flame.position.set((flames_pos.x+1)*16+8, flames_pos.y*16+8);
                                        this.gameboard[flames_pos.x+1][flames_pos.y] = new_flame;
                                        new_flame.addAI(FlamesController, {"level": 1});
                                        break;
                                    case "ice_cube":
                                        this.gameboard[flames_pos.x+1][flames_pos.y].destroy();
                                        this.gameboard[flames_pos.x+1][flames_pos.y] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ice"});
                                        break;
                                }       
                            }
                            if(this.gameboard[flames_pos.x][flames_pos.y+1] == null) {
                                new_flame = this.add.animatedSprite("flames", "primary");
                                new_flame.animation.play("level0");
                                new_flame.position.set(flames_pos.x*16+8, (flames_pos.y+1)*16+8);
                                this.gameboard[flames_pos.x][flames_pos.y+1] = new_flame;
                                new_flame.addAI(FlamesController, {"level": 0});
                            } else {
                                switch(this.gameboard[flames_pos.x][flames_pos.y+1].imageId) {
                                    case "torch":
                                        let anime = (<AnimatedSprite>this.gameboard[flames_pos.x][flames_pos.y+1]);
                                        if(anime.animation.isPlaying("off")) {
                                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                                            anime.animation.play("on");
                                        }
                                        break;
                                    case "bubble":
                                        this.gameboard[flames_pos.x][flames_pos.y+1].destroy();
                                        this.gameboard[flames_pos.x][flames_pos.y+1] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "water"});
                                        break;
                                    case "ember":
                                        this.gameboard[flames_pos.x][flames_pos.y+1].destroy();
                                        new_flame = this.add.animatedSprite("flames", "primary");
                                        new_flame.animation.play("level1");
                                        new_flame.position.set(flames_pos.x*16+8, (flames_pos.y+1)*16+8);
                                        this.gameboard[flames_pos.x][flames_pos.y+1] = new_flame;
                                        new_flame.addAI(FlamesController, {"level": 1});
                                        break;
                                    case "ice_cube":
                                        this.gameboard[flames_pos.x][flames_pos.y+1].destroy();
                                        this.gameboard[flames_pos.x][flames_pos.y+1] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ice"});
                                        break;
                                }       
                            }
                            if(this.gameboard[flames_pos.x-1][flames_pos.y] == null) {
                                new_flame = this.add.animatedSprite("flames", "primary");
                                new_flame.animation.play("level0");
                                new_flame.position.set((flames_pos.x-1)*16+8, flames_pos.y*16+8);
                                this.gameboard[flames_pos.x-1][flames_pos.y] = new_flame;
                                new_flame.addAI(FlamesController, {"level": 0});
                            } else {
                                switch(this.gameboard[flames_pos.x-1][flames_pos.y].imageId) {
                                    case "torch":
                                        let anime = (<AnimatedSprite>this.gameboard[flames_pos.x-1][flames_pos.y]);
                                        if(anime.animation.isPlaying("off")) {
                                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                                            anime.animation.play("on");
                                        }
                                        break;
                                    case "bubble":
                                        this.gameboard[flames_pos.x-1][flames_pos.y].destroy();
                                        this.gameboard[flames_pos.x-1][flames_pos.y] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "water"});
                                        break;
                                    case "ember":
                                        this.gameboard[flames_pos.x-1][flames_pos.y].destroy();
                                        new_flame = this.add.animatedSprite("flames", "primary");
                                        new_flame.animation.play("level1");
                                        new_flame.position.set((flames_pos.x-1)*16+8, flames_pos.y*16+8);
                                        this.gameboard[flames_pos.x-1][flames_pos.y] = new_flame;
                                        new_flame.addAI(FlamesController, {"level": 1});
                                        break;
                                    case "ice_cube":
                                        this.gameboard[flames_pos.x-1][flames_pos.y].destroy();
                                        this.gameboard[flames_pos.x-1][flames_pos.y] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ice"});
                                        break;
                                }       
                            }
                            if(this.gameboard[flames_pos.x][flames_pos.y-1] == null) {
                                new_flame = this.add.animatedSprite("flames", "primary");
                                new_flame.animation.play("level0");
                                new_flame.position.set(flames_pos.x*16+8, (flames_pos.y-1)*16+8);
                                this.gameboard[flames_pos.x][flames_pos.y-1] = new_flame;
                                new_flame.addAI(FlamesController, {"level": 0});
                            } else {
                                switch(this.gameboard[flames_pos.x][flames_pos.y-1].imageId) {
                                    case "torch":
                                        let anime = (<AnimatedSprite>this.gameboard[flames_pos.x][flames_pos.y-1]);
                                        if(anime.animation.isPlaying("off")) {
                                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                                            anime.animation.play("on");
                                        }
                                        break;
                                    case "bubble":
                                        this.gameboard[flames_pos.x][flames_pos.y-1].destroy();
                                        this.gameboard[flames_pos.x][flames_pos.y-1] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "water"});
                                        break;
                                    case "ember":
                                        this.gameboard[flames_pos.x][flames_pos.y-1].destroy();
                                        new_flame = this.add.animatedSprite("flames", "primary");
                                        new_flame.animation.play("level1");
                                        new_flame.position.set(flames_pos.x*16+8, (flames_pos.y-1)*16+8);
                                        this.gameboard[flames_pos.x][flames_pos.y-1] = new_flame;
                                        new_flame.addAI(FlamesController, {"level": 1});
                                        break;
                                    case "ice_cube":
                                        this.gameboard[flames_pos.x][flames_pos.y-1].destroy();
                                        this.gameboard[flames_pos.x][flames_pos.y-1] = null;
                                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ice"});
                                        break;
                                }       
                            }
                            break;
                    }
                    break;
                case CTCevent.IGNITE_BURN:
                    let flame = event.data.get("sprite");
                    let fire_hit = event.data.get("hitbox");
                    if(this.gameboard[fire_hit.x][fire_hit.y]){
                        let ignite_target = this.gameboard[fire_hit.x][fire_hit.y];
                        switch(ignite_target.imageId) {
                            case "ice_cube":
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "ice"} );
                                ignite_target.destroy();
                                this.gameboard[fire_hit.x][fire_hit.y] = null;
                                break;
                            case "torch":
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                                (<AnimatedSprite>ignite_target).animation.play("on");
                                break;
                        }
                    }
                    flame.destroy();
                    break;
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
                            this.falling_animation(target.imageId, dest.add(dir).scale(16).add(new Vec2(8, 8)));
                            break;
                        case "flames":
                            dest.add(dir);
                            let flames = this.gameboard[dest.x][dest.y];
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": -1});
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
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
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
                            break;
                        case "shallow_water":
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
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
                            this.falling_animation(target.imageId, dest.add(dir).scale(16).add(new Vec2(8, 8)));
                            break;
                        case "flames":
                            dest.add(dir);
                            let flames = this.gameboard[dest.x][dest.y];
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": -1});
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
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
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
                            break;
                        case "shallow_water":
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
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
                            this.falling_animation(target.imageId, dest.add(dir).scale(16).add(new Vec2(8, 8)));
                            break;
                        case "flames":
                            dest.add(dir);
                            let flames = this.gameboard[dest.x][dest.y];
                            this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": -1});
                            target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                            this.gameboard[targetposX][targetposY] = null;
                            this.gameboard[dest.x][dest.y] = target;
                            targetposX = dest.x;
                            targetposY = dest.y;
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
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            dest.add(dir);
                            let deepWater = this.gameboard[dest.x][dest.y];
                            let shallowWater = this.add.sprite("shallow_water", "primary");
                            shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                            deepWater.destroy();
                            this.gameboard[dest.x][dest.y] = shallowWater;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
                            break;
                        case "shallow_water":
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                            dest.add(dir);
                            this.gameboard[dest.x][dest.y].destroy();
                            this.gameboard[dest.x][dest.y] = null;
                            this.gameboard[targetposX][targetposY].destroy();
                            this.gameboard[targetposX][targetposY] = null;
                            this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
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
                let rolling = true;
                while(rolling) {
                    if(dest.x+dir.x<2 || dest.y+dir.y<2 || dest.x+dir.x>17 || dest.y+dir.y>17) break;
                    if(this.gameboard[dest.x+dir.x][dest.y+dir.y] == null) {
                        dest.add(dir);
                        target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                        this.gameboard[dest.x][dest.y] = target;
                        this.gameboard[targetposX][targetposY] = null;
                        targetposX = dest.x;
                        targetposY = dest.y;
                    } else {
                        switch(this.gameboard[dest.x+dir.x][dest.y+dir.y].imageId){
                            case "boss_block":
                                this.emitter.fireEvent(CTCevent.BOSS_DAMAGED);
                            case "hole":
                                this.gameboard[targetposX][targetposY] = null;
                                target.destroy();
                                this.falling_animation(target.imageId, dest.add(dir).scale(16).add(new Vec2(8, 8)));
                                rolling = false;
                                break;
                            case "flames":
                                dest.add(dir);
                                let flames = this.gameboard[dest.x][dest.y];
                                this.emitter.fireEvent(CTCevent.FLAMES_CHANGE, {"id": flames.id, "level": -1});
                                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                                this.gameboard[targetposX][targetposY] = null;
                                this.gameboard[dest.x][dest.y] = target;
                                targetposX = dest.x;
                                targetposY = dest.y;
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
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                                this.gameboard[targetposX][targetposY].destroy();
                                this.gameboard[targetposX][targetposY] = null;
                                dest.add(dir);
                                let deepWater = this.gameboard[dest.x][dest.y];
                                let shallowWater = this.add.sprite("shallow_water", "primary");
                                shallowWater.position.set(deepWater.position.x, deepWater.position.y);
                                deepWater.destroy();
                                this.gameboard[dest.x][dest.y] = shallowWater;
                                this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
                                rolling = false;
                                break;
                            case "shallow_water":
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                                dest.add(dir);
                                this.gameboard[dest.x][dest.y].destroy();
                                this.gameboard[dest.x][dest.y] = null;
                                this.gameboard[targetposX][targetposY].destroy();
                                this.gameboard[targetposX][targetposY] = null;
                                this.falling_animation(target.imageId, dest.scale(16).add(new Vec2(8, 8)));
                                rolling = false;
                                break;
                            case "rock_S":
                            case "rock_M":
                            case "rock_L":
                            case "tornado":
                            case "whirlwind":
                            case "ice_cube":
                            case "torch":
                            case "wall":
                            case "outofbounds":
                            case "boss_block":
                            case "portal":
                                rolling = false;
                                break;
                            default:
                                dest.add(dir);
                                target.position.set(dest.x*16 + 8, dest.y*16 + 8);
                                this.gameboard[dest.x][dest.y] = target;
                                this.gameboard[targetposX][targetposY] = null;
                                targetposX = dest.x;
                                targetposY = dest.y;
                                break;
                        }
                    }
                }
                break;
            case "whirlwind":
                if(this.elementSelected != 2) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "wind"} );
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
                stream.addAI(AirstreamController, {"start": stream_start, "end": stream_end, "size": 5, "dir": dir});
                this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": stream.id, "blocked": false});
                break;
            case "bubble":
                if(this.elementSelected != 3) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                target.destroy();
                let wave = this.add.sprite("wave", "primary");
                wave.position.set(targetposX*16+8, targetposY*16+8);
                if(dir.x == -1) {
                    wave.rotation = Math.PI;
                } else if(dir.y == 1) {
                    wave.rotation = 3*Math.PI/2;
                } else if(dir.y == -1) {
                    wave.rotation = Math.PI/2;
                }
                this.gameboard[targetposX][targetposY] = null;
                wave.addAI(WaveController, {"dir": dir});
                break;
            case "ember":
                if(this.elementSelected != 4) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
                let ignition = this.add.sprite("ignite", "sky");
                ignition.position.set(targetposX*16+16, targetposY*16+8);
                let hitbox = new Vec2(targetposX+1, targetposY);
                if(dir.x == -1) {
                    ignition.rotation = Math.PI;
                    ignition.position.set(targetposX*16, targetposY*16+8);
                    hitbox = new Vec2(targetposX-1, targetposY);
                } else if(dir.y == 1) {
                    ignition.rotation = 3*Math.PI/2;
                    ignition.position.set(targetposX*16+8, targetposY*16+16);
                    hitbox = new Vec2(targetposX, targetposY+1);
                } else if(dir.y == -1) {
                    ignition.rotation = Math.PI/2;
                    ignition.position.set(targetposX*16+8, targetposY*16);
                    hitbox = new Vec2(targetposX, targetposY-1);
                }
                ignition.addAI(IgniteController, {"hitbox": hitbox});
                break;
            case "ice_cube":
                if(this.elementSelected != 5) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "ice"} );
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "rock"} );
                this.skillUsed[0] = true;
                let place_rock = this.add.sprite("rock_P", "primary");
                place_rock.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_rock;
                player_controller.cast_animation();
                break;
            case 2:
                if (!player_controller.hasPower[1]) break;
                if(this.skillUsed[1]) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "wind"} );
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                this.skillUsed[2] = true;
                let place_water = this.add.sprite("bubble", "primary");
                place_water.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_water;
                player_controller.cast_animation();
                break;
            case 4:
                if (!player_controller.hasPower[3]) break;
                if(this.skillUsed[3]) break;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "fire"} );
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "ice"} );
                this.skillUsed[4] = true;
                let place_ice = this.add.sprite("ice_cube", "primary");
                place_ice.position.set(placeX*16+8, placeY*16+8);
                this.gameboard[placeX][placeY] = place_ice;
                player_controller.cast_animation();
                break;
        }
    }

    check_current_tile(pos: Vec2, dirVec: Vec2){
        if(this.player_moving) return;
        let pCol = pos.x;
        let pRow = pos.y;
        if(!this.inAir) {
            if(this.overlap[pCol][pRow]) {
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
                        this.whirlwind_fly(pCol, pRow, dirVec);
                        break;
                    case "bubble":
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "water"} );
                        this.bubble_shield(pCol, pRow);
                        break;
                    case "ember":
                        this.gameboard[pCol][pRow].destroy();
                        this.gameboard[pCol][pRow] =null;
                        break;
                    case "flames":
                        if((<AnimatedSprite>this.gameboard[pCol][pRow]).animation.isPlaying("level0")) {
                            break;
                        }
                        if(this.player_shield != null) {
                            this.player_shield = null;
                            (<PlayerController>this.player._ai).gainShield(false);
                            this.gameboard[pCol][pRow].destroy();
                            this.gameboard[pCol][pRow] = null;
                            break;
                        }
                    case "deep_water":
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
        }
        if(this.inAir) {
            if(this.savedVec != null){
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
                    case "wall":
                    case "outofbounds":
                    case "boss_block":
                        break;
                    default:
                        jumps = i;
                }
            } else {
                jumps = i;
            }
        }
        if(jumps>0) {
            this.player.position.set((posX+dirVec.x*jumps)*16+8,(posY+dirVec.y*jumps)*16+8);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "wind"});
        }
    }

    airstream_fly(posX: number, posY: number) {
        Input.disableInput();
        let nextX = posX+this.savedVec.x;
        let nextY = posY+this.savedVec.y;
        // end the loop
        if(this.overlap[nextX][nextY] ==  null) {
            if(this.gameboard[nextX][nextY]){
                switch(this.gameboard[nextX][nextY].imageId){
                    case "rock_P":
                    case "rock_S":
                    case "rock_M":
                    case "rock_L":
                    case "ice_cube":
                    case "torch":
                    case "wall":
                    case "outofbounds":
                    case "boss_block":
                        this.inAir = true;
                        this.savedVec = null;
                        break;
                    default:
                        this.inAir = true;
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "wind"} );
                        this.player.position.set(nextX*16+8, nextY*16+8);
                        this.savedVec = null;
                        break;
                }
            } else {
                this.inAir = true;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "wind"} );
                this.player.position.set(nextX*16+8, nextY*16+8);
                this.savedVec = null;
            }
        } else { // continue flying
            this.inAir = true;
            this.emitter.fireEvent(GameEventType.PLAY_SOUND,{key: "wind"} );
            this.player.position.set(nextX*16+8, nextY*16+8);
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

    falling_animation(imageid: string, pos: Vec2){
        var fall = this.add.sprite(imageid, "sky");
        fall.tweens.add("fall", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.scaleX,
                    start: 1,
                    end: .1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.scaleY,
                    start: 1,
                    end: .1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: CTCevent.DESTROY_ELEMENT,
            onEndData: {"target": fall}
        });
        fall.position.set(pos.x, pos.y);
        fall.tweens.play("fall");
    }
}