import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { CTCevent } from "../Scenes/CTCEvent";

export default class ElementController extends StateMachineAI {
    protected owner: Sprite;

    initializeAI(owner: Sprite, options: Record<string, any>){
        this.owner = owner;
    }

    update(deltaT: number): void {
		
	}
}