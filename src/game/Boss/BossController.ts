import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class BossController extends StateMachineAI {
    protected owner: Sprite;
    protected type: Element;
    protected health: number;

    update(deltaT: number): void {
        
    }
}