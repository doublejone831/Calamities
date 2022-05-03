import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class BossController extends StateMachineAI {
    protected owner: AnimatedSprite;
    protected type: string;
    protected health: number;
    protected thresholdReached: boolean;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;
        this.health = 6;
        this.type = options.type;
        this.thresholdReached = false;

        this.receiver.subscribe([
                                CTCevent.BOSS_DAMAGED, ]);
    }

    update(deltaT: number): void {
        if(this.thresholdReached){
            if(!this.owner.animation.isPlaying("teleport")) {
                this.teleport();
                this.thresholdReached = false;
            }   
        }
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case CTCevent.BOSS_DAMAGED:
                    this.damaged();
                    break;
            }
        }
    }

    damaged(){
        if(this.owner.animation.isPlaying("damaged") || this.owner.animation.isPlaying("teleport") || this.owner.animation.isPlaying("appear")) return;
        this.health--;
        this.owner.animation.play("damaged");
        this.owner.animation.queue("idle");
        if(this.health==2 || this.health==4){
            this.thresholdReached = true;
            this.owner.animation.play("teleport");
        }
        if(this.health == 0) {
            this.owner.animation.play("dying");
            this.owner.animation.queue("dead");
            this.emitter.fireEvent(CTCevent.BOSS_DEAD, {"pos": this.owner.position});
        }
    }

    teleport(){
        this.emitter.fireEvent(CTCevent.BOSS_TELEPORT, {});
    }
}