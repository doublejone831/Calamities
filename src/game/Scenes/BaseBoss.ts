import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import BaseStage from "./BaseStage";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { CTCevent } from "./CTCEvent";
import TornadoController from "../Element/TornadoController";
import AirstreamController from "../Element/AirstreamController";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import FlamesController from "../Element/FlamesController";
import PlayerController from "../Player/PlayerController";
import Input from "../../Wolfie2D/Input/Input";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class BaseBoss extends BaseStage {
    pos1: Vec2;
    pos2: Vec2;
    pos3: Vec2;
    currentPos: number;
    bossReceiver: Receiver;
    cursors: Array<AnimatedSprite>;
    paused: boolean;

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");

        this.initializeGameboard();

        this.cursors = new Array(9);
        this.paused = false;

        this.bossReceiver = new Receiver();
        this.bossReceiver.subscribe([
                                    CTCevent.BOSS_SKILL,
                                    CTCevent.BOSS_TELEPORT,
                                    CTCevent.BOSS_ATTACK,
                                    CTCevent.BOSS_DEAD,
                                    CTCevent.PLAYER_KILL,
                                    CTCevent.REMOVE_ATTACK,
                                    CTCevent.TOGGLE_PAUSE ]);

    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        while(this.bossReceiver.hasNextEvent()){
            let event = this.bossReceiver.getNextEvent();
            switch(event.type) {
                case CTCevent.BOSS_SKILL:
                    this.boss_skill();
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key:"bossskill"});
                    break;
                case CTCevent.BOSS_TELEPORT:
                    let currPosVec: Vec2 = null;
                    let nextPosVec: Vec2 = null;
                    switch (this.currentPos) {
                        case 1:
                            this.currentPos = 2;
                            currPosVec = this.pos1;
                            nextPosVec = this.pos2;
                            break;
                        case 2:
                            this.currentPos = 3;
                            currPosVec = this.pos2;
                            nextPosVec = this.pos3;
                            break;
                        case 3:
                            this.currentPos = 1;
                            currPosVec = this.pos3;
                            nextPosVec = this.pos1;
                            break;
                    }
                    let bossSprite = this.gameboard[currPosVec.x/16][currPosVec.y/16];
                    this.boss_dead(currPosVec.x/16, currPosVec.y/16);
                    this.boss_dead(nextPosVec.x/16, nextPosVec.y/16, bossSprite);
                    this.boss.position.set(nextPosVec.x, nextPosVec.y);
                    this.boss.animation.queue("idle", true);
                    break;
                case CTCevent.BOSS_ATTACK:
                    this.boss_attack();
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key:"bossattack"});
                    break;
                case CTCevent.BOSS_DEAD:
                    this.boss.removePhysics();
                    let pos = event.data.get("pos");
                    this.boss_dead(pos.x/16, pos.y/16);
                    this.endposition = new Vec2(pos.x/16, pos.y/16-1);
                    let exit = this.add.sprite("portal", "primary");
                    exit.position.set(this.endposition.x*16+8, this.endposition.y*16+8);
                    this.gameboard[pos.x/16][pos.y/16-1] = exit;
                    break;
                case CTCevent.PLAYER_KILL:
                    let topL = this.cursors[0].position;
                    let botR = this.cursors[8].position;
                    let playerPos = this.player.position;
                    for (let i = 0; i < this.cursors.length; i++) {
                        let explode = this.add.animatedSprite("explosion", "primary");
                        let aim = this.cursors[i];
                        if(i == 0) {
                            explode.animation.play("blink", false, CTCevent.REMOVE_ATTACK);
                        } else {
                            explode.animation.play("blink");
                        }
                        explode.position.set(aim.position.x, aim.position.y);
                        aim.destroy();
                        this.cursors[i] = explode;
                    }
                    if (playerPos.x >= topL.x && playerPos.x <= botR.x && playerPos.y >= topL.y && playerPos.y <= botR.y) {
                        let ai = <PlayerController>this.player._ai;
                        if (ai.hasShield) {
                            ai.gainShield(false);
                        }
                        else {
                            Input.disableInput();
                            for(let i = 0; i < this.cursors.length; i++) {
                                if(i == 0) {
                                    this.cursors[i].animation.play("blink", false, CTCevent.RESTART_STAGE);
                                } else {
                                    this.cursors[i].animation.play("blink");
                                }
                            }
                        }
                    }
                    break;
                case CTCevent.REMOVE_ATTACK:
                    for(let i = 0; i < this.cursors.length; i++) {
                        this.cursors[i].destroy();
                        this.cursors[i] = null;
                    }
                    break;
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    if (this.cursors[0]) {
                        if (this.paused) {
                            for (let i = 0; i < this.cursors.length; i++) this.cursors[i].animation.pause();
                        }
                        else {
                            for (let i = 0; i < this.cursors.length; i++) this.cursors[i].animation.resume();
                        }
                    }
                    break;
            }   
        }
    }

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
                    break;
                default:
                    sprite = this.add.sprite(element.type, "primary");
                    sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
                    this.gameboard[element.position[0]][element.position[1]] = sprite;
                    break;
            }
        }
        this.endposition = new Vec2(0, 0);
    }

    boss_skill(): void {
        for (let i = 2; i < this.gameboard.length - 2; i++) {
            for (let j = 2; j < this.gameboard[i].length - 2; j++) {
                let sprite = this.gameboard[i][j];
                if (sprite) {
                    if (sprite.imageId === "rock_S" || sprite.imageId === "rock_M" || sprite.imageId === "rock_L") {
                        this.gameboard[i][j] = null;
                        sprite.destroy();
                    }
                }
            }
        }
        for (let i = 0; i < 6; i++) {
            let type = RandUtils.randInt(0, 3);
            let x = RandUtils.randInt(2, 18);
            let y = RandUtils.randInt(2, 18);
            let spritePos = new Vec2(x*16 + 8, y*16 + 8);
            if (this.gameboard[x][y] || this.player.position.equals(spritePos)) {
                i--;
                continue;
            }
            let imageId = (type === 0) ? "rock_S" : ((type === 1) ? "rock_M" : "rock_L");
            let sprite = this.add.sprite(imageId, "primary");
            sprite.position.set(spritePos.x, spritePos.y);
            this.gameboard[x][y] = sprite;
        }
    }

    boss_attack(): void {
        for (let i = 0; i < 9; i++) {
            let cursor = this.add.animatedSprite("cursor", "primary");
            this.cursors[i] = cursor;
            if (i === 0) cursor.animation.play("blink", false, CTCevent.PLAYER_KILL);
            else cursor.animation.play("blink");
            let posX = this.player.position.x;
            let posY = this.player.position.y;
            switch (i) {
                case 0:
                    posX -= 16; posY -= 16;
                    break;
                case 1:
                    posY -= 16;
                    break;
                case 2:
                    posX += 16; posY -= 16;
                    break;
                case 3:
                    posX -= 16;
                    break;
                case 5:
                    posX += 16;
                    break;
                case 6:
                    posX -= 16; posY += 16;
                    break;
                case 7:
                    posY += 16;
                    break;
                case 8:
                    posX += 16; posY += 16;
                    break;
            }
            cursor.position.set(posX, posY);
        }
    }
}