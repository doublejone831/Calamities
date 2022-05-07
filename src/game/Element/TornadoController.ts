import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class TornadoController extends StateMachineAI {
    protected owner: Sprite;
    protected owner_pos: Vec2;
    protected start : Vec2; //board pos
    protected end : Vec2; //board pos
    protected size: number;
    protected reverse: boolean;
    protected dir: Vec2;
    protected frames: number;
    protected paused: boolean;

    initializeAI(owner: Sprite, options: Record<string, any>){
        this.owner = owner;
        this.start = options.start;
        this.end = options.end;
        this.reverse = false;
        if(this.start.x-this.end.x > 0) {
            this.dir = new Vec2(-1, 0);
        } else if(this.start.x-this.end.x < 0) {
            this.dir = new Vec2(1, 0);
        } else {
            if(this.start.y-this.end.y > 0) {
                this.dir = new Vec2(0, -1);
            } else if(this.start.y-this.end.y < 0) {
                this.dir = new Vec2(0, 1);
            } else {
                this.dir = new Vec2(0, 0);
            }

        }
        this.frames = 0;
        this.paused = false;

        this.receiver.subscribe([
                                CTCevent.TOGGLE_PAUSE,
                                CTCevent.TORNADO_BLOCKED ])
    }

    update(deltaT: number): void {
        this.owner_pos = new Vec2((this.owner.position.x-8)/16, (this.owner.position.y-8)/16);
        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch(event.type) {
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    break;
                case CTCevent.TORNADO_BLOCKED:
                    if(event.data.get("id") === this.owner.id) this.reverse = !this.reverse;
                    break;
            }
        }
        if(this.start.equals(this.end)) return;
        if(this.paused) {
            (<AnimatedSprite>this.owner).animation.pause();
        } else {
            (<AnimatedSprite>this.owner).animation.resume();
            if(this.frames%30 == 0) {
                if(this.owner_pos.equals(this.start)) this.reverse = false;
                if(this.owner_pos.equals(this.end)) this.reverse = true;
                let old_pos = this.owner_pos.clone();
                if(this.reverse) {    
                    let new_pos = this.owner_pos.clone().sub(this.dir);
                    this.emitter.fireEvent(CTCevent.TORNADO_MOVE_REQUEST, {"sprite": this.owner, "old": old_pos, "new": new_pos});
                } else {
                    let new_pos = this.owner_pos.clone().add(this.dir);
                    this.emitter.fireEvent(CTCevent.TORNADO_MOVE_REQUEST, {"sprite": this.owner, "old": old_pos, "new": new_pos});
                }
            }
            this.frames++;
        }
    }
}