import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class IgniteController extends StateMachineAI{
    protected owner: Sprite;
    protected hitbox: Vec2;
    protected paused: boolean;
    protected frames: number;

    initializeAI(owner: Sprite, options: Record<string, any>) {
        this.owner = owner;
        this.hitbox = options.hitbox;
        this.paused = false;
        this.frames = 0;

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
            if(this.frames>15) {
                this.emitter.fireEvent(CTCevent.IGNITE_BURN, {"sprite": this.owner, "hitbox": this.hitbox});
            }
            this.frames++;
        }
    }
}