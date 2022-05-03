import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import BossController from "../Boss/BossController";
import Fire from "./Fire";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import BaseBoss from "./BaseBoss";

export default class WaterBoss extends BaseBoss {

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
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        // boss
        this.load.spritesheet("boss", "game_assets/spritesheets/boss_water.json");
        this.load.image("boss_block", "game_assets/sprites/all_purpose_block.png");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/water.json");
        this.load.object("board", "game_assets/data/water_boss_board.json");
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.image("lock", "game_assets/sprites/lock.png");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
    }

    unloadScene(): void {
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();

        this.initializePlayer();

        this.initializeBoss();

        this.elementGUI.animation.play("earth_equipped");
        // Create lock layer
        this.addLayer("lock", 20);
        for(var i = 3; i<6; i++) {
            let lock = this.add.sprite("lock", "lock");
            lock.position.set(i*16+6, 19*16);
        }
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
    };

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
        this.pos3 = new Vec2(14*16, 9*16);
        this.currentPos = 1;
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