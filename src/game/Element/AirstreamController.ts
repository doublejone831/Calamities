import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";
import { Element } from "./Element_Enum";
export default class AirstreamController extends StateMachineAI {
    protected owner: Sprite;
    protected start : Vec2;
    protected end : Vec2;
    protected size: number;
    protected dir: Vec2;
    protected frames: number;
    protected paused: boolean;

    initializeAI(owner: Sprite, options: Record<string, any>){
        this.owner = owner;
        this.start = options.start;
        this.end = options.end;
        this.size = options.size;
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
        this.frames++;
    }

    extend_airstream(new_size: number){
        if(!this.paused) {
            this.emitter.fireEvent(CTCevent.AIRSTREAM_EXTEND, {"start": this.start, "sprite": this.owner, "dir": this.dir, "size": new_size});
        }
    }
}