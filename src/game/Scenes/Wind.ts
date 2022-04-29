import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import WindBoss from "./WindBoss";
import ElementController from "../Element/ElementController";
import { Element } from "../Element/Element_Enum";

export default class Wind extends BaseStage {
    airstreams: Array<Array<Vec2>>;

    loadScene(){
        // elements
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("tornado", "game_assets/spritesheets/tornado.json");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/wind.json");
        this.load.object("board", "game_assets/data/wind_board.json");
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        this.load.image("hole", "game_assets/sprites/hole.png");
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

        this.initializePlayer();

        this.elementGUI.animation.play("earth_equipped");
        // Create lock layer
        this.addLayer("lock", 20);
        for(var i = 2; i<6; i++) {
            let lock = this.add.sprite("lock", "lock");
            lock.position.set(i*16+6, 19*16);
        }
    }

    updateScene(deltaT: number): void{
        for(var i = 0; i<this.airstreams.length; i++){
            for(var j = 0; j<this.airstreams[i].length; j++){
                let pos = this.airstreams[i][j];
                this.gameboard[pos.x][pos.y];
            }
        }
        super.updateScene(deltaT);
    };

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");
        this.airstreams = new Array(4).fill(null);
        let counter = 0;
        this.addLayer("sky", 15);
        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            var sprite;
            switch(element.type) {
                case "tornado":
                    sprite = this.add.animatedSprite(element.type, "primary");
                    sprite.position.set(element.start[0]*16+8, element.start[1]*16+8);
                    sprite.animation.play("idle");
                    let start = new Vec2(element.start[0], element.start[1]);
                    let end = new Vec2(element.end[0], element.end[1]);
                    sprite.addAI(ElementController, {"type": Element.TORNADO, "start": start, "end": end});
                    this.gameboard[start.x][start.y] = sprite;
                    break;
                case "airstream":
                    let x_start = element.start[0];
                    let y_start = element.start[1];
                    let x_end = element.end[0];
                    let y_end = element.end[1];
                    this.airstreams[counter] = new Array(element.size).fill(null);
                    switch(element.direction){
                        case "right":
                            for(let i = x_start; i<= x_end; i++) {
                                sprite = this.add.animatedSprite(element.type, "primary");
                                sprite.position.set(i*16+8, y_start*16+8);
                                sprite.animation.play("stream");
                                this.gameboard[i][y_start] = sprite;
                                this.airstreams[counter][i-x_start] = new Vec2(i, y_start);
                            }
                            break;
                        case "left":
                            for(let i = x_end; i<= x_start; i++) {
                                sprite = this.add.animatedSprite(element.type, "primary");
                                sprite.position.set(i*16+8, y_start*16+8);
                                sprite.animation.play("stream");
                                sprite.rotation = Math.PI;
                                this.gameboard[i][y_start] = sprite;
                                this.airstreams[counter][x_start-i] = new Vec2(i, y_start);
                            }
                            break;
                        case "down":
                            for(let i = y_start; i<= y_end; i++) {
                                sprite = this.add.animatedSprite(element.type, "primary");
                                sprite.position.set(x_start*16+8, i*16+8);
                                sprite.animation.play("stream");
                                sprite.rotation = 3*Math.PI/2;
                                this.gameboard[x_start][i] = sprite;
                                this.airstreams[counter][i-y_start] = new Vec2(x_start, i);
                            }
                            break;
                        case "up":
                            for(let i = y_end; i<= y_start; i++) {
                                sprite = this.add.animatedSprite(element.type, "primary");
                                sprite.position.set(x_start*16+8, i*16+8);
                                sprite.animation.play("stream");
                                sprite.rotation = Math.PI/2;
                                this.gameboard[x_start][i] = sprite;
                                this.airstreams[counter][y_start-i] = new Vec2(x_start, i);
                            }
                            break;
                    }
                    counter++;
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
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.inAir = false;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,false,false,false,false]});
    }

    restartStage(): void{
        this.sceneManager.changeToScene(Wind, {});
    }

    nextStage(): void {
        this.sceneManager.changeToScene(WindBoss, {});
    }
}