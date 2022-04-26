import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import BossController from "../Boss/BossController";
import Fire from "./Fire";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { CTCevent } from "./CTCEvent";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class WaterBoss extends BaseStage {
    private boss: AnimatedSprite;
    protected pos1: Vec2;
    protected pos2: Vec2;
    protected pos3: Vec2;
    protected bossReceiver: Receiver;

    loadScene(){
        // elements
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.image("gust", "game_assets/sprites/gust.png");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        this.load.spritesheet("whirlwind", "game_assets/spritesheets/whirlwind.json");
        this.load.image("shallow_water", "game_assets/sprites/shallow_water.png");
        this.load.image("deep_water", "game_assets/sprites/deep_water.png");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        // boss
        this.load.spritesheet("boss", "game_assets/spritesheets/boss_water.json");
        this.load.image("boss_block", "game_assets/sprites/all_purpose_block.png");
        // map
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        this.load.tilemap("level", "game_assets/tilemaps/water.json");
        this.load.object("board", "game_assets/data/water_boss_board.json");
        this.load.image("portal", "game_assets/sprites/portal.png");
        //gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
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

        this.initializeBoss();

        this.elementGUI.animation.play("earth_equipped");

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
                    break;
            }
        }
    };

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

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,false,false,false]});
    }

    initializeBoss(): void {
        this.boss = this.add.animatedSprite("boss", "primary");
        this.boss.animation.play("idle");
        this.pos1 = new Vec2(10*16, 15*16);
        this.pos2 = new Vec2(5*16, 5*16);
        this.pos3 = new Vec2(14*16, 14*16);
        this.boss.position.set(this.pos1.x, this.pos1.y);
        let boardPos = this.pos1.scaled(1/16);
        this.block = new Sprite("boss_block");
        this.boss_dead(boardPos.x, boardPos.y, this.block);
        this.boss.addPhysics(new AABB(Vec2.ZERO, new Vec2(16, 16)));
        this.boss.addAI(BossController, {type: "water"});
    }

    restartStage(): void {
        this.sceneManager.changeToScene(WaterBoss, {});
    }

    nextStage(): void {
        this.sceneManager.changeToScene(Fire, {});
    }
}