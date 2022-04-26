import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { Player_enums } from "./Player_enums";
import { CTCevent } from "../Scenes/CTCEvent";
import Earth from "../Scenes/Earth";

export default class PlayerController extends StateMachineAI {
    protected owner: AnimatedSprite;
    tilemap: OrthogonalTilemap;
    selectedElement: number;
    //indicate which direction player facing
    facing_direction: Player_enums;

    hasPower: Array<Boolean>;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.selectedElement = 1;

        this.facing_direction = Player_enums.FACING_DOWN;

        this.hasPower = new Array(5).fill(true);
        this.receiver.subscribe([CTCevent.PLAYER_MOVE])
    }

    update(deltaT: number): void {
        var next_position = this.nextposition();
		if (Input.isJustPressed("up")) {
            if(this.facing_direction == Player_enums.FACING_UP){
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
            }
            this.facing_direction = Player_enums.FACING_UP;
            this.owner.animation.play("walking_up");
        }
        else if (Input.isJustPressed("left")) {
            if(this.facing_direction == Player_enums.FACING_LEFT){
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
            }
            this.facing_direction = Player_enums.FACING_LEFT;
            this.owner.animation.play("walking_left");
        }
        else if (Input.isJustPressed("down")) {
            if(this.facing_direction == Player_enums.FACING_DOWN){
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
            }
            this.facing_direction = Player_enums.FACING_DOWN;
            this.owner.animation.play("walking_down");
        }
        else if (Input.isJustPressed("right")) {
            if(this.facing_direction == Player_enums.FACING_RIGHT){
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
            }
            this.facing_direction = Player_enums.FACING_RIGHT;
            this.owner.animation.play("walking_right");
        }
        else if (Input.isJustPressed("interact")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.interact();
        }
        else if (Input.isJustPressed("place")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.placing_element();
            
        }
        else if (Input.isJustPressed("el1") && this.hasPower[0]) {
            this.selectedElement = 1;
            this.emitter.fireEvent(CTCevent.CHANGE_ELEMENT, {"el" : this.selectedElement});
        }
        else if (Input.isJustPressed("el2") && this.hasPower[1]) {
            this.selectedElement = 2;
            this.emitter.fireEvent(CTCevent.CHANGE_ELEMENT, {"el" : this.selectedElement});
        }
        else if (Input.isJustPressed("el3") && this.hasPower[2]) {
            this.selectedElement = 3;
            this.emitter.fireEvent(CTCevent.CHANGE_ELEMENT, {"el" : this.selectedElement});
        }
        else if (Input.isJustPressed("el4") && this.hasPower[3]) {
            this.selectedElement = 4;
            this.emitter.fireEvent(CTCevent.CHANGE_ELEMENT, {"el" : this.selectedElement});
        }
        else if (Input.isJustPressed("el5") && this.hasPower[4]) {
            this.selectedElement = 5;
            this.emitter.fireEvent(CTCevent.CHANGE_ELEMENT, {"el" : this.selectedElement});
        }
        else if (Input.isJustPressed("esc")) {
            console.log("paused");
            Earth.paused = !Earth.paused;
            //CTC todo: pause the game
        }
        // CTC TODO: if the level-end portal is a tile, use this.tilemap field here to fire the LEVEL_END event (should be similar to HW5 testing if switch is below player)
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            switch(event.type){
                case CTCevent.PLAYER_MOVE:
                    switch(this.facing_direction){
                        case Player_enums.FACING_UP:
                            this.owner.move(new Vec2(0, -16));
                            break;
                        case Player_enums.FACING_DOWN:
                            this.owner.move(new Vec2(0, 16));
                            break;
                        case Player_enums.FACING_RIGHT:
                            this.owner.move(new Vec2(16, 0));
                            break;
                        case Player_enums.FACING_LEFT:
                            this.owner.move(new Vec2(-16, 0));
                            break;
                    }
            }
        }
	}

    nextposition(){
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
            posX = (posX - 8) / 16;
            posY = (posY - 8) / 16;
            // not absolute coordinant => Index of gameboard
            var next_position = new Vec2(posX, posY);

            return next_position;
    }

    interact(){
        var next = this.nextposition();
        this.emitter.fireEvent(CTCevent.INTERACT_ELEMENT, {"positionX": next.x, "positionY": next.y, "direction": this.facing_direction});
    }
    placing_element(){
        var next = this.nextposition();
        this.emitter.fireEvent(CTCevent.PLACE_ELEMENT, {"positionX": next.x, "positionY": next.y, "type": this.selectedElement});
    }

}