import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BaseStage from "./BaseStage";
import PlayerController from "../Player/PlayerController";
import EarthBoss from "./EarthBoss";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class Earth extends BaseStage {

    loadScene(){
        // elements
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        // player
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        // map
        this.load.tilemap("level", "game_assets/tilemaps/earth.json");
        this.load.image("block", "game_assets/sprites/all_purpose_block.png");
        this.load.object("board", "game_assets/data/earth_board.json");
        this.load.image("portal", "game_assets/sprites/portal.png");
        // gui
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");

        this.load.audio("level_music", "game_assets/sound/song.mp3");
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

        this.elementGUI.animation.play("none_equipped");
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void{
        super.updateScene(deltaT);
    };

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");

        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            let sprite = this.add.sprite(element.type, "primary");
            sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
            this.gameboard[element.position[0]][element.position[1]] = sprite;
            if(element.type === "portal") {
                this.endposition = new Vec2(element.position[0], element.position[1]);
            }
        } 
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16+8, 3*16+8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.skillUsed = new Array(5).fill(false);
        this.elementSelected = 0;
        this.player.addAI(PlayerController, {tilemap: "Main", hasPower: [false,false,false,false,false]});
    }

    restartStage(): void{
        this.sceneManager.changeToScene(Earth, {});
    }

    nextStage(): void {
        MainMenu.unlocked[0] = true;
        this.sceneManager.changeToScene(EarthBoss, {});
    }
}