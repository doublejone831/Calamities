import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class WaveController extends StateMachineAI {
    protected owner: Sprite;
    protected dir: Vec2;
    protected paused: boolean;
    protected frames: number;

    initializeAI(owner: Sprite, options: Record<string, any>) {
        this.owner = owner;
        this.dir = options.dir;
        this.paused = false;
        this.frames = 1;

        this.receiver.subscribe(CTCevent.TOGGLE_PAUSE);
    }

    update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    break;
            }
        }
        if(!this.paused) {
            if(this.frames%15 == 0) {
                this.emitter.fireEvent(CTCevent.WAVE_SPLASH, {"sprite": this.owner, "dir": this.dir});
            }
            this.frames++;
        }
    }
}