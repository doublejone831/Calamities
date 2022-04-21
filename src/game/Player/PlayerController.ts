import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { CTCevent } from "../Scenes/CTCEvent";
import BaseStage from "../Scenes/BaseStage";

export default class PlayerController extends StateMachineAI {
    protected owner: AnimatedSprite;
    tilemap: OrthogonalTilemap;
    selectedElement: number;
    //indicate which direction player facing
    facing_direction: number; //0=up, 1=left, 2=down, 3=right
    hasPower: Array<Boolean>;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.selectedElement = 1;

        this.facing_direction = 2; //start down

        this.hasPower = options.hasPower;

        this.receiver.subscribe([CTCevent.PLAYER_MOVE])
    }

    update(deltaT: number): void {
        if (Input.isJustPressed("esc")) {
            this.emitter.fireEvent(CTCevent.TOGGLE_PAUSE);
        }
        if(!BaseStage.paused) {
            if (Input.isJustPressed("up")) {
                Input.disableInput();
                this.facing_direction = 0;
                var next_position = this.nextposition();
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
                this.owner.animation.play("face_0");
            }
            else if (Input.isJustPressed("left")) {
                Input.disableInput();
                this.facing_direction = 1;
                var next_position = this.nextposition();
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
                this.owner.animation.play("face_1");
            }
            else if (Input.isJustPressed("down")) {
                Input.disableInput();
                this.facing_direction = 2;
                var next_position = this.nextposition();
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
                this.owner.animation.play("face_2");
            }
            else if (Input.isJustPressed("right")) {
                Input.disableInput();
                this.facing_direction = 3;
                var next_position = this.nextposition();
                this.emitter.fireEvent(CTCevent.PLAYER_MOVE_REQUEST, {"next" : next_position});
                this.owner.animation.play("face_3");
            }
            else if (Input.isJustPressed("rotate_cc")) {
                this.facing_direction = (this.facing_direction + 1) % 4;
                this.owner.animation.play("face_" + this.facing_direction);
            }
            else if (Input.isJustPressed("rotate_c")) {
                this.facing_direction = (this.facing_direction + 3) % 4;
                this.owner.animation.play("face_" + this.facing_direction);
            }
            else if (Input.isJustPressed("interact")) {
                this.interact();
            }
            else if (Input.isJustPressed("place")) {
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
            
            // CTC TODO: if the level-end portal is a tile, use this.tilemap field here to fire the LEVEL_END event (should be similar to HW5 testing if switch is below player)
            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();
                let scaling = event.data.get("scaling");
                switch(event.type){
                    case CTCevent.PLAYER_MOVE:
                        switch(this.facing_direction){
                            case 0:
                                this.owner.move(new Vec2(0, -16).scaled(scaling));
                                break;
                            case 1:
                                this.owner.move(new Vec2(-16, 0).scaled(scaling));
                                break;
                            case 2:
                                this.owner.move(new Vec2(0, 16).scaled(scaling));
                                break;
                            case 3:
                                this.owner.move(new Vec2(16, 0).scaled(scaling));
                                break;
                        }
                        this.owner.animation.play("walking_" + this.facing_direction);
                        Input.enableInput();
                    break;
                }
            }
        }
	}

    nextposition(){
        var posX = this.owner.position.x;
        var posY = this.owner.position.y;
        switch(this.facing_direction){
            case 0:
                posY -= 16;
                break;
            case 1:
                posX -= 16;
                break;
            case 2:
                posY += 16;
                break;
            case 3:
                posX += 16;
                break;
            }
            // not absolute coordinant => Index of gameboard
            var next_position = this.sprite_pos_to_board_pos(posX, posY);
            return next_position;
    }

    // position in pixels to position to row col
    sprite_pos_to_board_pos(posX: number, posY: number){
        return new Vec2((posX-8)/16, (posY-8)/16);
    }

    // position in row col to pixels
    board_pos_to_sprite_pos(posX: number, posY: number){
        return new Vec2(16*posX+8, 16*posY+8);
    }

    interact(){
        var next = this.nextposition();
        this.emitter.fireEvent(CTCevent.INTERACT_ELEMENT, {"positionX": next.x, "positionY": next.y, "direction": this.facing_direction});
    }
    placing_element(){
        var next = this.nextposition();
        this.emitter.fireEvent(CTCevent.PLACE_ELEMENT, {"positionX": next.x, "positionY": next.y, "type": this.selectedElement});
    }

    cast_animation(){
        this.owner.animation.play("casting_" + this.facing_direction);
    }
}