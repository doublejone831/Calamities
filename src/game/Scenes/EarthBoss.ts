import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import BossController from "../Boss/BossController";
import Wind from "./Wind";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import MainMenu from "./MainMenu";
import BaseBoss from "./BaseBoss";

export default class EarthBoss extends BaseBoss {

    loadScene(){
        // elements
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        // boss
        this.load.spritesheet("boss", "game_assets/spritesheets/boss_earth.json");
        this.load.image("boss_block", "game_assets/sprites/all_purpose_block.png");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/earth.json");
        this.load.object("board", "game_assets/data/earth_boss_board.json");
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.image("lock", "game_assets/sprites/lock.png");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
        // audio
        this.load.audio("level_music", "game_assets/sound/song.mp3");
        this.load.audio("rock", "game_assets/sound/rock.wav");
    }

    unloadScene(): void {
        this.load.unloadAllResources();
    }

    startScene(){
        super.startScene();

        this.initializePlayer();

        this.initializeBoss();

        this.elementGUI.animation.play("none_equipped");
        // Create lock layer
        this.addLayer("lock", 20);
        for(var i = 1; i<6; i++) {
            let lock = this.add.sprite("lock", "lock");
            lock.position.set(i*16+6, 19*16);
        }
        
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
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
        this.elementSelected = 0;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [false,false,false,false,false]});
    }

    initializeBoss(): void {
        this.boss = this.add.animatedSprite("boss", "primary");
        this.boss.animation.play("idle");
        this.pos1 = new Vec2(10*16, 15*16);
        this.pos2 = new Vec2(5*16, 5*16);
        this.pos3 = new Vec2(14*16, 14*16);
        this.currentPos = 1;
        this.boss.position.set(this.pos1.x, this.pos1.y);
        this.block = new Sprite("boss_block");
        this.boss_dead(this.pos1.x/16, this.pos1.y/16, this.block);
        this.boss.addPhysics(new AABB(Vec2.ZERO, new Vec2(16, 16)));
        this.boss.addAI(BossController, {type: "earth"});
    }

    restartStage(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(EarthBoss, {});
    }

    nextStage(): void {
        MainMenu.unlocked[1] = true;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(Wind, {});
    }
}