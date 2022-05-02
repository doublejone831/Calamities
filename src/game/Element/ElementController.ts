import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";
import { Element } from "./Element_Enum";
export default class ElementController extends StateMachineAI {
    protected owner: Sprite;
    protected type : Element;
    protected start : Vec2;
    protected end : Vec2;
    protected size: number;
    protected reverse: boolean;
    protected dir: Vec2;
    protected frames: number;
    protected paused: boolean;

    initializeAI(owner: Sprite, options: Record<string, any>){
        this.owner = owner;
        this.type = options.type;
        this.start = options.start.scaled(16).add(new Vec2(8, 8));
        this.end = options.end.scaled(16).add(new Vec2(8, 8));
        this.size = options.size;
        this.reverse = true;
        if(this.start.x-this.end.x > 0) {
            this.dir = new Vec2(-1, 0);
        } else if(this.start.x-this.end.x < 0) {
            this.dir = new Vec2(1, 0);
        } else {
            if(this.start.y-this.end.y > 0) {
                this.dir = new Vec2(0, -1);
            } else if(this.start.y-this.end.y < 0) {
                this.dir = new Vec2(0, 1);
            }
        }
        this.frames = 0;
        this.paused = false;

        this.receiver.subscribe([
                                CTCevent.TOGGLE_PAUSE,
                                CTCevent.AIRSTREAM_BLOCKED ])
    }

    update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch(event.type) {
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    break;
                case CTCevent.AIRSTREAM_BLOCKED:
                    if(this.owner.id == event.data.get("id")) {
                        if(event.data.get("blocked")) {
                            this.extend_airstream(event.data.get("new_size"));
                        } else {
                            this.extend_airstream(this.size);
                        }
                    }
            }
        }
        switch(this.type){
            case Element.TORNADO:
                this.move_tornado();
                break;
        }
        this.frames++;
    }

    move_tornado(){
        if(this.paused) {
            (<AnimatedSprite>this.owner).animation.pause();
        } else {
            (<AnimatedSprite>this.owner).animation.resume();
            if(this.frames%30 == 0) {
                if(this.owner.position.equals(this.start) || this.owner.position.equals(this.end)) this.reverse = !this.reverse;
                let old_pos = new Vec2(this.owner.position.x, this.owner.position.y);
                if(this.reverse) {    
                    let new_pos = this.owner.position.add(this.dir.scaled(-16));
                    this.emitter.fireEvent(CTCevent.WHIRLWIND_MOVE, {"sprite": this.owner, "old": old_pos, "new": new_pos});
                } else {
                    let new_pos = this.owner.position.add(this.dir.scaled(16));
                    this.emitter.fireEvent(CTCevent.WHIRLWIND_MOVE, {"sprite": this.owner, "old": old_pos, "new": new_pos});
                }
            }
        }
    }

    extend_airstream(new_size: number){
        if(!this.paused) {
            this.emitter.fireEvent(CTCevent.AIRSTREAM_EXTEND, {"start": this.start, "sprite": this.owner, "dir": this.dir, "size": new_size});
        }
    }
}