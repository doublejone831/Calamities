import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Earth extends Scene {
    private walls: OrthogonalTilemap;
    private player: AnimatedSprite;

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
        
        this.initializePlayer();

        this.viewport.follow(this.player);

        // Zoom in to a reasonable level
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(4);

        // CTC TODO: I DONT KNOW BUT GAMEPLAY STUFF PROBABLY GOES HERE OR IN UPDATESCENE METHOD
    }

    updateScene(){
        
    }

    initializePlayer(): void {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.position.set(3*16, 3*16);
        // CTC TODO: ADD PLAYERCONTROLLER AI OR SOMETHING TO MAKE KEYBOARD INPUTS WORK
    }
}