import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export default class PlayerController extends StateMachineAI {
    protected owner: AnimatedSprite;
    tilemap: OrthogonalTilemap;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
    }

    update(deltaT: number): void {
		if (Input.isJustPressed("up")) {
            this.owner.move(new Vec2(0, -16));
            this.owner.animation.play("walking_up");
        }
        else if (Input.isJustPressed("left")) {
            this.owner.move(new Vec2(-16, 0));
            this.owner.animation.play("walking_left");
        }
        else if (Input.isJustPressed("down")) {
            this.owner.move(new Vec2(0, 16));
            this.owner.animation.play("walking_down");
        }
        else if (Input.isJustPressed("right")) {
            this.owner.move(new Vec2(16, 0));
            this.owner.animation.play("walking_right");
        }
        if (Input.isJustPressed("interact")) {
            // CTC TODO: get direction player is facing somehow and tie it into casting animation
        }
        else if (Input.isJustPressed("place")) {
            // CTC TODO: get direction player is facing somehow and tie it into casting animation
        }
        else {
            if (! this.owner.animation.isPlaying("idle")) this.owner.animation.queue("idle", true);
            // CTC TODO: idle animation only looks down so probably remove this else block
        }
	}
}