import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import BossController from "../Boss/BossController";
import Ice from "./Ice";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import BaseBoss from "./BaseBoss";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";

export default class FireBoss extends BaseBoss {

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
        // boss
        this.load.spritesheet("boss", "game_assets/spritesheets/boss_fire.json");
        this.load.image("boss_block", "game_assets/sprites/invis_block.png");
        this.load.spritesheet("explosion", "game_assets/spritesheets/explosion.json");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/fire_boss.json");
        this.load.object("board", "game_assets/data/fire_boss_board.json");
        this.load.image("outofbounds", "game_assets/sprites/invis_block.png");
        this.load.image("wall", "game_assets/sprites/fire_wall.png");
        this.load.image("portal", "game_assets/sprites/portal.png");
        this.load.image("hole", "game_assets/sprites/hole.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.image("lock", "game_assets/sprites/lock.png");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");

        this.load.audio("level_music", "game_assets/sound/song.mp3");
        this.load.audio("rock", "game_assets/sound/rock.wav");
        this.load.audio("wind", "game_assets/sound/wind.wav");
        this.load.audio("water", "game_assets/sound/water.wav");
        this.load.audio("fire", "game_assets/sound/fire.wav");
        this.load.audio("bossattack", "game_assets/sound/bossattack.wav");
        this.load.audio("bossskill", "game_assets/sound/bossskill.wav");
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
        for(var i = 4; i<6; i++) {
            let lock = this.add.sprite("lock", "lock");
            lock.position.set(i*16+6, 19*16);
        }
        
        this.initializePlayer();

        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
        if(!this.endposition.equals(new Vec2(0, 0))){
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
        }
    };

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "lock");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 1;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [true,true,true,false,false]});
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
        this.boss.addAI(BossController, {type: "fire"});
    }

    restartStage(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.sceneManager.changeToScene(FireBoss, {});
    }

    nextStage(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.viewport.setZoomLevel(1);
        this.sceneManager.changeToScene(MainMenu, {});
    }
}