import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class FlamesController extends StateMachineAI {
    protected owner: AnimatedSprite;
    protected level: number;
    protected paused: boolean;
    protected frames: number;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>) {
        this.owner = owner;
        this.level = options.level;
        this.paused = false;
        this.frames = 1;

        this.receiver.subscribe([CTCevent.TOGGLE_PAUSE,
                                CTCevent.FLAMES_CHANGE, ]);
    }

    update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    break;
                case CTCevent.FLAMES_CHANGE:
                    if(event.data.get("id") === this.owner.id) {
                        this.level = event.data.get("level");
                        this.owner.animation.play("level"+this.level);
                        this.frames = 1;
                    }
                    break;
            }
        }
        if(!this.paused) {
            if(this.level == 0 && this.frames%30 == 0) {
                this.emitter.fireEvent(CTCevent.FLAMES_GROW, {"sprite": this.owner, "level": 0});
            } else {
                if(this.frames%100 == 0) {
                    this.emitter.fireEvent(CTCevent.FLAMES_GROW, {"sprite": this.owner, "level": this.level});
                }
            }
            this.frames++;
        }
    }
}