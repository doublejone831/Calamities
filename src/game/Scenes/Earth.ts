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

export default class Earth extends Scene {
    private walls: OrthogonalTilemap;
    private player: AnimatedSprite;
    protected gameboard : Array<Array<Sprite>>;
    loadScene(){
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");

        this.load.tilemap("level", "game_assets/tilemaps/earth.json");
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

         // Get the wall layer 
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        

        this.addLayer("primary", 10);
        
        this.initializeElements();
        
        this.initializePlayer();

        this.gameboard = new Array(20);
            for (var i = 0; i < 20; i++) {
            this.gameboard[i] = new Array(20);
        }
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
        this.player.position.set(3*16, 3*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        this.player.addAI(PlayerController, {tilemap: "Main"});
    }

    initializeElements(): void {
        // CTC TODO: initElementPool? if Rock.ts,Bubble.ts,etc all extend Element.ts, then we can write a json with position & elementType (as well as numObjects at the top) and parse it in this method, creating an array of elements. Size of array would be numObjects + 5 (we can potentially spawn in 1 of each element). If looping through the array would have to check these last 5 for NULL values, this can also be helpful in enforcing the restriction of only 1 element can be placed on the map.
    }
}