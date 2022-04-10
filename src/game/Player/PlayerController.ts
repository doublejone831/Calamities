import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { Player_enums } from "./Player_enums";

export default class PlayerController extends StateMachineAI {
    protected owner: AnimatedSprite;
    tilemap: OrthogonalTilemap;
    selectedElement: number;
    //indicate which direction player facing
    facing_direction: Player_enums;

    hasPower: Array<Boolean>;
    //elementArray, array of all the elements on the map + 5 spaces to place

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.selectedElement = 1;

        this.facing_direction = Player_enums.FACING_DOWN;

        this.hasPower = new Array(5).fill(false);
    }

    update(deltaT: number): void {
		if (Input.isJustPressed("up")) {
            // CTC TODO: probably shouldnt be able to move if theres, for instance, a rock in the tile youre trying to move in, so have to account for that for each direction.
            this.owner.move(new Vec2(0, -16));
            this.facing_direction = Player_enums.FACING_UP;
            this.owner.animation.play("walking_up");
        }
        else if (Input.isJustPressed("left")) {
            this.owner.move(new Vec2(-16, 0));
            this.facing_direction = Player_enums.FACING_LEFT;
            this.owner.animation.play("walking_left");
        }
        else if (Input.isJustPressed("down")) {
            this.owner.move(new Vec2(0, 16));
            this.facing_direction = Player_enums.FACING_DOWN;
            this.owner.animation.play("walking_down");
        }
        else if (Input.isJustPressed("right")) {
            this.owner.move(new Vec2(16, 0));
            this.facing_direction = Player_enums.FACING_RIGHT;
            this.owner.animation.play("walking_right");
        }
        if (Input.isJustPressed("interact")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.interact();
        }
        else if (Input.isJustPressed("place")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.place();
        }
        else if (Input.isJustPressed("el1") && this.hasPower[0]) {
            this.selectedElement = 1;
        }
        else if (Input.isJustPressed("el2") && this.hasPower[1]) {
            this.selectedElement = 2;
        }
        else if (Input.isJustPressed("el3") && this.hasPower[2]) {
            this.selectedElement = 3;
        }
        else if (Input.isJustPressed("el4") && this.hasPower[3]) {
            this.selectedElement = 4;
        }
        else if (Input.isJustPressed("el5") && this.hasPower[4]) {
            this.selectedElement = 5;
        }
	}

    interact(): void {
        // CTC TODO: Interact with element
        // see below for some idea on testing if theres an element in front of us to interact with
        // assuming we have elementArray, if we find an Element object in front of us, then call its interact function (im assuming it will have one), might have to pass in a parameter for which direction its being interacted with from.
    }

    place(): void {
        // CTC TODO: Place element
        /* Idea: if (hasPower[selectedElement] && elementArray[some position] == null) {
            direction = getPlayerDirection();
            use direction to get position of tile in front of player
            if theres no wall in that tile, loop through elementArray and see if any element's position = above position
            if none do, then we can create a new element, put it in elementArray & on map in appropriate positions
            (maybe have to use event firing to update elementArray in Earth.ts if we have it there too?)

            some of this idea can also probably work for interact() function, idk
        }*/
    }
}