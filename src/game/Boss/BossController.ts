import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

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