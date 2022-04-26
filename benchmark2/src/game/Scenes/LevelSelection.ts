import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2d/Nodes/UIElements/Button";
import MainMenu from "./MainMenu";
import Input from "../../Wolfie2D/Input/Input";
import Earth from "./Earth";

export default class LevelSelection extends Scene {
    private levels: Layer;

    loadScene(){}

    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.levels = this.addUILayer("levels");

        const levelsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x, center.y - 250), text: "Level Select"});
        levelsHeader.fontSize = 50;

        /* EARTH ROW */
        const earthHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y - 150), text: "EARTH"});;

        const earth = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y - 150), text: "Puzzle Stage"});
        earth.size.set(200, 50);
        earth.borderWidth = 2;
        earth.borderColor = Color.BLACK;
        earth.backgroundColor = new Color(0,255,213);
        earth.textColor = Color.BLACK;
        earth.onClickEventId = "play-earth";

        const earthB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y - 150), text: "Boss Stage"});
        earthB.clone(earth, "play-earth-boss");

        /* WIND ROW */
        const windHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y - 75), text: "WIND"});;

        const wind = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y - 75), text: "Puzzle Stage"});
        wind.clone(earth, "play-wind");

        const windB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y - 75), text: "Boss Stage"});
        windB.clone(earth, "play-wind-boss");

        /* WATER ROW */
        const waterHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y), text: "WATER"});;

        const water = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y), text: "Puzzle Stage"});
        water.clone(earth, "play-water");

        const waterB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y), text: "Boss Stage"});
        waterB.clone(earth, "play-water-boss");

        /* FIRE ROW */
        const fireHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y + 75), text: "FIRE"});;

        const fire = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 75), text: "Puzzle Stage"});
        fire.clone(earth, "play-fire");

        const fireB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y + 75), text: "Boss Stage"});
        fireB.clone(earth, "play-fire-boss");

        /* ICE ROW */
        const iceHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y + 150), text: "ICE"});;

        const ice = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 150), text: "Puzzle Stage"});
        ice.clone(earth, "play-ice");

        const iceB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y + 150), text: "Boss Stage"});
        iceB.clone(earth, "play-ice-boss");

        /* BACK BUTTON */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        back.clone(earth, "back");

        this.receiver.subscribe("play-earth");
        this.receiver.subscribe("back");
    }

    updateScene(){
        // CTC TODO: ADD THE CHEATS
        if (Input.isKeyJustPressed("y")) {
            console.log("CHEAT: UNLOCK ALL LEVELS");
        }
        if (Input.isKeyJustPressed("u")) {
            console.log("CHEAT: UNLOCK ALL ELEMENTAL SKILS");
        }
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play-earth"){
                this.sceneManager.changeToScene(Earth, {});
            }

            // CTC TODO: ADD THE OTHER LEVELS AND SUBSCRIBE TO THE EVENTS

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }
}