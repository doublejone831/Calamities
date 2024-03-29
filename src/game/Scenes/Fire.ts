import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import FireBoss from "./FireBoss";
import MainMenu from "./MainMenu";
import AirstreamController from "../Element/AirstreamController";
import TornadoController from "../Element/TornadoController";
import { CTCevent } from "./CTCEvent";
import FlamesController from "../Element/FlamesController";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";

export default class Fire extends BaseStage {
    switch1: AnimatedSprite;
    switch2: AnimatedSprite;

    loadScene(){
        // elements
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("tornado", "game_assets/spritesheets/tornado.json");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        this.load.spritesheet("whirlwind", "game_assets/spritesheets/whirlwind.json");
        this.load.image("shallow_water", "game_assets/sprites/shallow_water.png");
        this.load.image("deep_water", "game_assets/sprites/deep_water.png");
        this.load.image("bubble", "game_assets/sprites/bubble.png");
        this.load.image("wave", "game_assets/sprites/wave.png");
        this.load.spritesheet("flames", "game_assets/spritesheets/flames.json");
        this.load.spritesheet("torch", "game_assets/spritesheets/torch.json");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.image("shield", "game_assets/sprites/shield.png");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/fire.json");
        this.load.object("board", "game_assets/data/fire_board.json");
        this.load.image("outofbounds", "game_assets/sprites/invis_block.png");
        this.load.image("wall", "game_assets/sprites/fire_wall.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        this.load.image("hole", "game_assets/sprites/hole.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.image("lock", "game_assets/sprites/lock.png");

        this.load.audio("level_music", "game_assets/sound/song.mp3");
        this.load.audio("rock", "game_assets/sound/rock.wav");
        this.load.audio("wind", "game_assets/sound/wind.wav");
        this.load.audio("water", "game_assets/sound/water.wav");
        this.load.audio("fire", "game_assets/sound/fire.wav");
    }

    unloadScene(): void {
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");

        this.switch1 = null;
        this.switch2 = null;
        this.initializeGameboard();

        this.elementGUI.animation.play("earth_equipped");
        // Create lock layer
        this.addLayer("lock", 20);
        for(var i = 4; i<6; i++) {
            let lock = this.add.sprite("lock", "lock");
            lock.position.set(i*16+6, 19*16);
        }

        this.initializePlayer();
        
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        if(this.switch1 != null && this.switch2 != null) {
            if(this.switch1.animation.isPlaying("on") && this.switch2.animation.isPlaying("on")) {
                for(var i = 2; i<18; i++) {
                    for(var j = 2; j<18; j++) {
                        if(this.gameboard[i][j]) {
                            if(this.gameboard[i][j].imageId == "flames") {
                                this.gameboard[i][j].destroy();
                                this.gameboard[i][j] = null;
                            }
                        }
                    }
                }
                let portal = this.add.sprite("portal", "primary");
                portal.position.set(this.switch1.position.x, this.switch1.position.y);
                this.gameboard[(this.switch1.position.x-8)/16][(this.switch1.position.y-8)/16].destroy();
                this.gameboard[(this.switch1.position.x-8)/16][(this.switch1.position.y-8)/16] = portal;
                this.endposition = new Vec2((portal.position.x-8)/16, (portal.position.y-8)/16);
            }
        }
    };

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");
        var start;
        var end;
        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            var sprite;
            var controller;
            switch(element.type) {
                case "tornado":
                    start = new Vec2(element.start[0], element.start[1]);
                    end = new Vec2(element.end[0], element.end[1]);
                    controller = this.add.animatedSprite(element.type, "primary");
                    controller.position.set(start.x*16+8, start.y*16+8);
                    controller.animation.play("idle");
                    controller.addAI(TornadoController, {"start": start, "end": end});
                    this.gameboard[start.x][start.y] = controller;
                    break;
                case "airstream":
                    start = new Vec2(element.start[0], element.start[1]);
                    end = new Vec2(element.end[0], element.end[1]);
                    switch(element.direction){
                        case "right":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = 0;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size, "dir": new Vec2(1, 0)});
                            break;
                        case "left":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = Math.PI;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size, "dir": new Vec2(-1, 0)});
                            break;
                        case "down":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = 3*Math.PI/2;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size, "dir": new Vec2(0, 1)});
                            break;
                        case "up":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = Math.PI/2;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size, "dir": new Vec2(0, -1)});
                    }
                    this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": controller.id, "blocked": false});
                    break;
                case "flames":
                    controller = this.add.animatedSprite("flames", "primary");
                    controller.animation.play("level"+element.firepower);
                    controller.position.set(element.position[0]*16+8, element.position[1]*16+8);
                    controller.addAI(FlamesController, {"level": element.firepower});
                    this.gameboard[element.position[0]][element.position[1]] = controller;
                    break;
                case "torch":
                    sprite = this.add.animatedSprite("torch", "primary");
                    sprite.animation.play("off");
                    sprite.position.set(element.position[0]*16+8, element.position[1]*16+8);
                    this.gameboard[element.position[0]][element.position[1]] = sprite;
                    if(this.switch1 == null) {
                        this.switch1 = sprite;
                    } else {
                        this.switch2 = sprite;
                    }
                    break;
                default:
                    sprite = this.add.sprite(element.type, "primary");
                    sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
                    this.gameboard[element.position[0]][element.position[1]] = sprite;
            }
        }
        this.endposition = new Vec2(0, 0);
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "lock");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.inAir = false;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,true,false,false]});
    }

    restartStage(): void{
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.sceneManager.changeToScene(Fire, {});
    }

    nextStage(): void {
        MainMenu.unlocked[6] = true;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.sceneManager.changeToScene(FireBoss, {});
    }
}