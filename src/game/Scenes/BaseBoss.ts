import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import BaseStage from "./BaseStage";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { CTCevent } from "./CTCEvent";

export default class BaseBoss extends BaseStage {
    pos1: Vec2;
    pos2: Vec2;
    pos3: Vec2;
    bossReceiver: Receiver;

    startScene(){
        super.startScene();
        // Add in the tilemap
        this.add.tilemap("level");

        this.initializeGameboard();

        this.bossReceiver = new Receiver();
        this.bossReceiver.subscribe([
                                    CTCevent.BOSS_SKILL,
                                    CTCevent.BOSS_TELEPORT,
                                    CTCevent.BOSS_ATTACK,
                                    CTCevent.BOSS_DEAD ]);

    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        while(this.bossReceiver.hasNextEvent()){
            let event = this.bossReceiver.getNextEvent();
            switch(event.type) {
                case CTCevent.BOSS_SKILL:
                    break;
                case CTCevent.BOSS_TELEPORT:
                    break;
                case CTCevent.BOSS_ATTACK:
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
            }   
        }
    }

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");

        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            var sprite;
            if(element.type === "airstream") {
                sprite = this.add.animatedSprite(element.type, "primary");
                sprite.animation.play("stream");
            } else {
                sprite = this.add.sprite(element.type, "primary");
            }
            sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
            this.gameboard[element.position[0]][element.position[1]] = sprite;
        }
        this.endposition = new Vec2(0, 0);
    }
}