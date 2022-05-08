import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import BossController from "../Boss/BossController";
import MainMenu from "./MainMenu";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import BaseBoss from "./BaseBoss";

export default class IceBoss extends BaseBoss {

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
        // boss
        this.load.spritesheet("boss", "game_assets/spritesheets/boss_ice.json");
        this.load.image("boss_block", "game_assets/sprites/invis_block.png");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/ice.json");
        this.load.object("board", "game_assets/data/ice_boss_board.json");
        this.load.image("outofbounds", "game_assets/sprites/invis_block.png");
        this.load.image("wall", "game_assets/sprites/ice_wall.png");
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

        this.initializeBoss();

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

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "lock");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,true,true,false]});
    }

    initializeBoss(): void {
        this.boss = this.add.animatedSprite("boss", "primary");
        this.boss.animation.play("idle");
        this.pos1 = new Vec2(10*16, 15*16);
        this.pos2 = new Vec2(5*16, 5*16);
        this.pos3 = new Vec2(15*16, 10*16);
        this.currentPos = 1;
        this.boss.position.set(this.pos1.x, this.pos1.y);
        let boardPos = this.pos1.scaled(1/16);
        let hitbox = new Sprite("boss_block");
        this.boss_dead(boardPos.x, boardPos.y, hitbox);
        this.boss.addPhysics(new AABB(Vec2.ZERO, new Vec2(16, 16)));
        this.boss.addAI(BossController, {type: "ice"});
    }

    restartStage(): void {
        this.sceneManager.changeToScene(IceBoss, {});
    }

    nextStage(): void {
        this.viewport.setZoomLevel(1);
        this.sceneManager.changeToScene(MainMenu, {});
    }
}