import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import IceBoss from "./IceBoss";
import MainMenu from "./MainMenu";
import { CTCevent } from "./CTCEvent";
import AirstreamController from "../Element/AirstreamController";
import TornadoController from "../Element/TornadoController";

export default class Ice extends BaseStage {

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
        this.load.image("flames1", "game_assets/sprites/flames1.png");
        this.load.image("flames2", "game_assets/sprites/flames2.png");
        this.load.image("flames3", "game_assets/sprites/flames3.png");
        this.load.spritesheet("ember", "game_assets/spritesheets/ember.json");
        this.load.image("ignite", "game_assets/sprites/ignite.png");
        this.load.image("ice_cube", "game_assets/sprites/ice_cube.png");
        this.load.spritesheet("torch", "game_assets/spritesheets/torch.json");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.image("shield", "game_assets/sprites/shield.png");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/ice.json");
        this.load.object("board", "game_assets/data/test_board.json");
        this.load.image("outofbounds", "game_assets/sprites/invis_block.png");
        this.load.image("wall", "game_assets/sprites/ice_wall.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.image("lock", "game_assets/sprites/lock.png");
    }

    unloadScene(): void {
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");

        this.initializeGameboard();

        this.elementGUI.animation.play("earth_equipped");
        // Create lock layer
        this.addLayer("lock", 20);
        let lock = this.add.sprite("lock", "lock");
        lock.position.set(5*16+6, 19*16);

        this.initializePlayer();
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
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
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size});
                            break;
                        case "left":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = Math.PI;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size});
                            break;
                        case "down":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = 3*Math.PI/2;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size});
                            break;
                        case "up":
                            controller = this.add.animatedSprite(element.type, "sky");
                            controller.position.set(start.x*16+8, start.y*16+8);
                            controller.rotation = Math.PI/2;
                            controller.alpha = 0;
                            controller.animation.play("stream");
                            controller.addAI(AirstreamController, {"start": start, "end": end, "size": element.size});
                    }
                    this.emitter.fireEvent(CTCevent.AIRSTREAM_BLOCKED, {"id": controller.id, "blocked": false});
                    break;
                case "portal":
                    this.endposition = new Vec2(element.position[0], element.position[1]);
                default:
                    sprite = this.add.sprite(element.type, "primary");
                    sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
                    this.gameboard[element.position[0]][element.position[1]] = sprite;
            }
        }
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "lock");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.inAir = false;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,true,true,false]});
    }

    restartStage(): void{
        this.sceneManager.changeToScene(Ice, {});
    }

    nextStage(): void {
        MainMenu.unlocked[8] = true;
        this.sceneManager.changeToScene(IceBoss, {});
    }
}