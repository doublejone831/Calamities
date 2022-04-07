import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainMenu from "./MainMenu";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class SplashScreen extends Scene {
    private splash: Layer;
    private logo: Sprite;

    loadScene(){
        this.load.image("logo", "game_assets/sprites/logo.png");
    }

    startScene(){
        const center = this.viewport.getCenter();

        this.splash = this.addUILayer("splash");

        /* Game logo */
        this.logo = this.add.sprite("logo", "splash");
        this.logo.scale.set(2, 2);
        this.logo.alpha = 0;
		this.logo.position = new Vec2(center.x, center.y - 100);
        this.logo.tweens.add("fadeIn", {
            startDelay: 1000,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        /* Click anywhere text */
        const clickText = "Click Anywhere To Continue";
        const clickLabel = <Label>this.add.uiElement(UIElementType.LABEL, "splash", {position: new Vec2(center.x, center.y + 250), text: clickText});
        clickLabel.textColor = new Color(0, 0, 0, 0);
        clickLabel.fontSize = 50;
        clickLabel.tweens.add("fadeIn", {
            startDelay: 2000,
            duration: 1000,
            effects: [
                {
                    property: "textAlpha",
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.logo.tweens.play("fadeIn");
        clickLabel.tweens.play("fadeIn");
    }

    updateScene(){
        if (Input.isMouseJustPressed()) {
            this.sceneManager.changeToScene(MainMenu, {});
        }
    }
}