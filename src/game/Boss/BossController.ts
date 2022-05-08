import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CTCevent } from "../Scenes/CTCEvent";

export default class BossController extends StateMachineAI {
    protected owner: AnimatedSprite;
    protected type: string;
    protected health: number;
    protected thresholdReached: boolean;
    protected frames: number;
    protected charge: number;
    protected paused: boolean;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;
        this.health = 6;
        this.type = options.type;
        this.thresholdReached = false;
        this.frames = 0;
        this.charge = 0;
        this.paused = false;

        this.receiver.subscribe([
                                CTCevent.TOGGLE_PAUSE,
                                CTCevent.BOSS_DAMAGED ]);
    }

    update(deltaT: number): void {
        if (this.health <= 0) return;
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case CTCevent.TOGGLE_PAUSE:
                    this.paused = !this.paused;
                    break;
                case CTCevent.BOSS_DAMAGED:
                    this.damaged();
                    break;
            }
        }
        if (this.paused) {
            this.owner.animation.pause();
        }
        else {
            this.owner.animation.resume();
            this.charge++;
            this.frames++;
            if (this.frames === 1000) {
                this.owner.animation.stop();
                this.owner.animation.play("attack_left", false, CTCevent.BOSS_SKILL);
                this.owner.animation.queue("idle", true);
                this.frames = 0;
            }
            if (this.charge === 400) {
                if (!this.owner.animation.isPlaying("attack_left")) this.owner.animation.play("attack_right");
                this.owner.animation.queue("idle", true);
                this.emitter.fireEvent(CTCevent.BOSS_ATTACK);
                this.charge = 0;
            }
            if(this.thresholdReached){
                if(!this.owner.animation.isPlaying("teleport")) {
                    this.teleport();
                    this.thresholdReached = false;
                }   
            }
        }
    }

    damaged(){
        if(this.owner.animation.isPlaying("damaged") || this.owner.animation.isPlaying("teleport") || this.owner.animation.isPlaying("appear")) return;
        this.health--;
        this.owner.animation.play("damaged");
        if(this.health==2 || this.health==4){
            this.thresholdReached = true;
            this.owner.animation.play("teleport");
            this.owner.animation.queue("appear");
        }
        else {
            this.owner.animation.queue("idle", true);
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