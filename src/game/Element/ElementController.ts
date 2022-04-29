import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";
import { Element } from "./Element_Enum";
export default class ElementController extends StateMachineAI {
    protected owner: Sprite;
    protected type : Element;
    protected start : Vec2;
    protected end : Vec2;
    protected reverse: boolean;
    protected dir: Vec2;
    protected frames: number;

    initializeAI(owner: Sprite, options: Record<string, any>){
        this.owner = owner;
        this.type = options.type;
        this.start = options.start.scaled(16).add(new Vec2(8, 8));
        this.end = options.end.scaled(16).add(new Vec2(8, 8));
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
    }

    update(deltaT: number): void {
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
        this.frames++;
    }
}