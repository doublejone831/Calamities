import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export default class PlayerController extends StateMachineAI {
    protected owner: AnimatedSprite;
    tilemap: OrthogonalTilemap;
    selectedElement: number;
    hasPower: Array<Boolean>;
    //elementArray, array of all the elements on the map + 5 spaces to place

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.selectedElement = 1;

        this.hasPower = new Array(5); // CTC TODO: verify that all are false by default
    }

    update(deltaT: number): void {
		if (Input.isJustPressed("up")) {
            // CTC TODO: probably shouldnt be able to move if theres, for instance, a rock in the tile youre trying to move in, so have to account for that for each direction.
            this.owner.move(new Vec2(0, -16));
            this.owner.animation.play("walking_up");
        }
        else if (Input.isJustPressed("left")) {
            this.owner.move(new Vec2(-16, 0));
            this.owner.animation.play("walking_left");
        }
        else if (Input.isJustPressed("down")) {
            this.owner.move(new Vec2(0, 16));
            this.owner.animation.play("walking_down");
        }
        else if (Input.isJustPressed("right")) {
            this.owner.move(new Vec2(16, 0));
            this.owner.animation.play("walking_right");
        }
        if (Input.isJustPressed("interact")) {
            // CTC TODO: get direction player is facing with getPlayerDirection() and tie it into casting animation
            this.interact();
        }
        else if (Input.isJustPressed("place")) {
            // CTC TODO: get direction player is facing with getPlayerDirection() and tie it into casting animation
            this.place();
        }
        else if (Input.isJustPressed("el1")) {
            this.selectedElement = 1;
        }
        else if (Input.isJustPressed("el2")) {
            this.selectedElement = 2;
        }
        else if (Input.isJustPressed("el3")) {
            this.selectedElement = 3;
        }
        else if (Input.isJustPressed("el4")) {
            this.selectedElement = 4;
        }
        else if (Input.isJustPressed("el5")) {
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

    getPlayerDirection(): string {
        // CTC TODO: use owner.animation.getIndex() or something to get the index of the current frame of the player on the spritesheet,
        // compare this index to the indices of the ends of the up,down,left,right animations for walking&casting and return "up","down","left","right" for the direction (may have to test for default frame as facing down i think)
        // would return null if mid-animation unless we test for the index in a range for the given animation (ex. index 0-4 for walking_up or whatever)
        // alternatively there might be a function in AnimationManager class that returns the current animation or the last animation that was played, if so could just use that
        return null;
    }
}