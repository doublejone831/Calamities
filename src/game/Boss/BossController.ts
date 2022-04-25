import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

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
    }

    update(deltaT: number): void {
        if(this.thresholdReached){
            this.teleport();
        }
    }

    damaged(){
        this.health--;
        if(this.health==2 || this.health==4){
            this.thresholdReached = true;
        }
    }

    teleport(){
        
    }
}