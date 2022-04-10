import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { Player_enums } from "./Player_enums";
import { CTCevent } from "../Scenes/CTCEvent";

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
            if(this.facing_direction == Player_enums.FACING_UP){
                this.owner.move(new Vec2(0, -16));}
            this.facing_direction = Player_enums.FACING_UP;
            this.owner.animation.play("walking_up");
        }
        else if (Input.isJustPressed("left")) {
            if(this.facing_direction == Player_enums.FACING_LEFT){
            this.owner.move(new Vec2(-16, 0));}
            this.facing_direction = Player_enums.FACING_LEFT;
            this.owner.animation.play("walking_left");
        }
        else if (Input.isJustPressed("down")) {
            if(this.facing_direction == Player_enums.FACING_DOWN){
            this.owner.move(new Vec2(0, 16));}
            this.facing_direction = Player_enums.FACING_DOWN;
            this.owner.animation.play("walking_down");
        }
        else if (Input.isJustPressed("right")) {
            if(this.facing_direction == Player_enums.FACING_RIGHT){
            this.owner.move(new Vec2(16, 0));}
            this.facing_direction = Player_enums.FACING_RIGHT;
            this.owner.animation.play("walking_right");
        }
        if (Input.isJustPressed("interact")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.interact();
        }
        else if (Input.isJustPressed("place")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.placing_element();
            
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

    interact(){
        var posX = this.owner.position.x;
        var posY = this.owner.position.y;
        switch(this.facing_direction){
            case Player_enums.FACING_DOWN:
                posY += 16;
                break;
            case Player_enums.FACING_UP:
                posY -= 16;
                break;
            case Player_enums.FACING_LEFT:
                posX -= 16;
                break;
            case Player_enums.FACING_RIGHT:
                posX += 16;
                break;
            }
            posX /= 16;
            posY /= 16;
            this.emitter.fireEvent(CTCevent.INTERACT_ELEMENT, {"positionX": posX, "positionY": posY, "type": this.selectedElement});
    }
    placing_element(){
        var posX = this.owner.position.x;
        var posY = this.owner.position.y;
        switch(this.facing_direction){
            case Player_enums.FACING_DOWN:
                posY += 16;
                break;
            case Player_enums.FACING_UP:
                posY -= 16;
                break;
            case Player_enums.FACING_LEFT:
                posX -= 16;
                break;
            case Player_enums.FACING_RIGHT:
                posX += 16;
                break;
            }
            posX /= 16;
            posY /= 16;
            this.emitter.fireEvent(CTCevent.PLACE_ELEMENT, {"positionX": posX, "positionY": posY, "type": this.selectedElement});
    }
}