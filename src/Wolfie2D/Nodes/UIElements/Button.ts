import Label from "./Label";
import Color from "../../Utils/Color";
import Vec2 from "../../DataTypes/Vec2";

/** A clickable button UIElement */
export default class Button extends Label {

	constructor(position: Vec2, text: string){
		super(position, text);
		
		this.backgroundColor = new Color(150, 75, 203);
		this.borderColor = new Color(41, 46, 30);
		this.textColor = new Color(255, 255, 255);
	}

	// @override
	calculateBackgroundColor(): Color {
		// Change the background color if clicked or hovered
		if(this.isEntered && !this.isClicked){
			return this.backgroundColor.lighten();
		} else if(this.isClicked){
			return this.backgroundColor.darken();
		} else {
			return this.backgroundColor;
		}
	}

	clone(orig: Button, onClickEventId: string, unlocked: Boolean) : void {
		this.backgroundColor = orig.backgroundColor;
		this.borderColor = orig.borderColor;
		this.textColor = orig.textColor;
		this.size = orig.size;
		this.borderWidth = orig.borderWidth;

		this.onClickEventId = onClickEventId;

		if (!unlocked) {
			this.backgroundColor = new Color(orig.backgroundColor.r, orig.backgroundColor.g, orig.backgroundColor.b, 0.5);
		}
	}
}