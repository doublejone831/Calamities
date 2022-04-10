import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Player/PlayerController";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { CTCevent } from "./CTCEvent";
import ElementController from "../Element/ElementController";

export default class Earth extends Scene {
    private walls: OrthogonalTilemap;
    private player: AnimatedSprite;
    protected gameboard : Array<Array<Sprite>>;
    loadScene(){
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");

        this.load.spritesheet("god", "game_assets/spritesheets/god.json");

        this.load.tilemap("level", "game_assets/tilemaps/earth.json");

        this.load.object("board", "game_assets/data/earth_board.json");
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

         // Get the wall layer 
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.gameboard = new Array(this.walls.getDimensions().y);
        for (var i = 0; i < this.walls.getDimensions().y; i++) {
            this.gameboard[i] = new Array(this.walls.getDimensions().x).fill(null);
        }

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        this.addLayer("primary", 10);
        
        this.initializeGameboard();

        console.log(this.gameboard);
        
        this.initializePlayer();

        // Zoom in to a reasonable level
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(4);

        this.viewport.follow(this.player);

        this.receiver.subscribe([
            CTCevent.INTERACT_ELEMENT, 
            CTCevent.PLACE_ELEMENT,
        ]);
        
        // CTC TODO: I DONT KNOW BUT GAMEPLAY STUFF PROBABLY GOES HERE OR IN UPDATESCENE METHOD
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            switch(event.type){
                case CTCevent.INTERACT_ELEMENT:
                    console.log("interact happened");
                    console.log(event.data.get("positionX"));
                    console.log(event.data.get("positionY"));
                    break;
                case CTCevent.PLACE_ELEMENT:
                    console.log("placing happened");
                    console.log(event.data.get("positionX"));
                    console.log(event.data.get("positionY"));
                    break;
            }
        }
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3*16 + 8, 3*16 + 8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.player.addAI(PlayerController, {tilemap: "Main"});
    }

    initializeGameboard(): void {
        let boardData = this.load.getObject("board");
        for (let i = 0; i < boardData.numElements; i++) {
            let element = boardData.elements[i];
            let sprite = this.add.sprite(element.type, "primary");
            sprite.position.set(element.position[0]*16 + 8, element.position[1]*16 + 8);
            sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
            sprite.addAI(ElementController, {});
            this.gameboard[element.position[0]][element.position[1]] = sprite;
        }
    }
}