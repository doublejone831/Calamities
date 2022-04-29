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
    inFlight: number;
    hasShield: boolean;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.selectedElement = 1;

        this.facing_direction = 2; //start down

        this.hasPower = options.hasPower;
        this.inFlight = 0;
        this.hasShield = false;

        this.receiver.subscribe([CTCevent.PLAYER_MOVE, CTCevent.FLY])
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
            
            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();  
                var dir;
                switch(event.type){
                    case CTCevent.PLAYER_MOVE:
                        let scaling = event.data.get("scaling");
                        dir = this.dirUnitVector(16);
                        this.owner.move(dir.scaled(scaling));
                        this.owner.animation.play("walking_" + this.facing_direction);
                        Input.enableInput();
                        break;
                    case CTCevent.FLY:
                        this.owner.position.add(this.dirUnitVector(16));
                        break;
                }
            }
        }
	}

    getDirection(){
        return this.facing_direction;
    }

    changeDirection(dir: number){
        this.facing_direction = dir;
    }

    nextposition(){
        // not absolute coordinant => Index of gameboard
        let playerPos = new Vec2(this.owner.position.x, this.owner.position.y);
        var next_position = playerPos.add(this.dirUnitVector(16));
        return this.sprite_pos_to_board_pos(next_position.x, next_position.y);
    }

    takeFlight(){
        this.inFlight = 3;
    }

    gainShield(shield: boolean){
        this.hasShield = shield;
    }

    // position in pixels to position to row col
    sprite_pos_to_board_pos(posX: number, posY: number){
        return new Vec2((posX-8)/16, (posY-8)/16);
    }

    // position in row col to pixels
    board_pos_to_sprite_pos(posX: number, posY: number){
        return new Vec2(16*posX+8, 16*posY+8);
    }

    dirUnitVector(scaling: number = null){
        var dir;
        var scale;
        if(scaling !== null) {
            scale = scaling;
        } else {
            scale = 1;
        }
        switch(this.facing_direction) {
            case 0:
                dir = new Vec2(0, -1);
                break;
            case 1:
                dir = new Vec2(-1, 0);
                break;
            case 2:
                dir = new Vec2(0, 1);
                break;
            case 3:
                dir = new Vec2(1, 0);
                break;
        }
        return dir.scaled(scale);
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