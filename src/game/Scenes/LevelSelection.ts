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
import Wind from "./Wind";
import Water from "./Water";
import Fire from "./Fire";
import Ice from "./Ice";
import EarthBoss from "./EarthBoss";
import WindBoss from "./WindBoss";
import WaterBoss from "./WaterBoss";
import FireBoss from "./FireBoss";
import IceBoss from "./IceBoss";

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
        earthB.clone(earth, "play-earth-boss", MainMenu.unlocked[0]);

        /* WIND ROW */
        const windHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y - 75), text: "WIND"});;

        const wind = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y - 75), text: "Puzzle Stage"});
        wind.clone(earth, "play-wind", MainMenu.unlocked[1]);

        const windB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y - 75), text: "Boss Stage"});
        windB.clone(earth, "play-wind-boss", MainMenu.unlocked[2]);

        /* WATER ROW */
        const waterHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y), text: "WATER"});;

        const water = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y), text: "Puzzle Stage"});
        water.clone(earth, "play-water", MainMenu.unlocked[3]);

        const waterB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y), text: "Boss Stage"});
        waterB.clone(earth, "play-water-boss", MainMenu.unlocked[4]);

        /* FIRE ROW */
        const fireHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x - 225, center.y + 75), text: "FIRE"});;

        const fire = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 75), text: "Puzzle Stage"});
        fire.clone(earth, "play-fire", MainMenu.unlocked[5]);

        const fireB = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x + 250, center.y + 75), text: "Boss Stage"});
        fireB.clone(earth, "play-fire-boss", MainMenu.unlocked[6]);

        /* ICE ROW */

        const ice = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 150), text: "EXPERIMENTAL"});
        ice.clone(earth, "play-ice", true);
        ice.size = new Vec2(300, 50);

        /* BACK BUTTON */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        back.clone(earth, "back", true);

        this.receiver.subscribe(["back",
                                "play-earth",
                                "play-earth-boss",
                                "play-wind",
                                "play-wind-boss",
                                "play-fire",
                                "play-fire-boss",
                                "play-water",
                                "play-water-boss",
                                "play-ice"]);
    }

    updateScene(){
        // CTC TODO: ADD THE CHEATS
        if (Input.isKeyJustPressed("y")) {
            console.log("CHEAT: UNLOCK ALL LEVELS");
            MainMenu.unlocked.fill(true);
            this.sceneManager.changeToScene(LevelSelection);
        }
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            switch(event.type) {
                case "play-earth":
                    this.sceneManager.changeToScene(Earth);
                    break;
                case "play-earth-boss":
                    if (MainMenu.unlocked[0]) {
                        this.sceneManager.changeToScene(EarthBoss);
                    }
                    break;
                case "play-wind":
                    if (MainMenu.unlocked[1]) {
                        this.sceneManager.changeToScene(Wind);
                    }
                    break;
                case "play-wind-boss":
                    if (MainMenu.unlocked[2]) {
                        this.sceneManager.changeToScene(WindBoss);
                    }
                    break;
                case "play-water":
                    if (MainMenu.unlocked[3]) {
                        this.sceneManager.changeToScene(Water);
                    }
                    break;
                case "play-water-boss":
                    if (MainMenu.unlocked[4]) {
                        this.sceneManager.changeToScene(WaterBoss);
                    }
                    break;
                case "play-fire":
                    if (MainMenu.unlocked[5]) {
                        this.sceneManager.changeToScene(Fire);
                    }
                    break;
                case "play-fire-boss":
                    if (MainMenu.unlocked[6]) {
                        this.sceneManager.changeToScene(FireBoss);
                    }
                    break;
                case "play-ice":
                    this.sceneManager.changeToScene(Ice);
                    break;
            }

            // CTC TODO: ADD THE OTHER LEVELS AND SUBSCRIBE TO THE EVENTS, USE IF(MainMenu.unlocked[i]) TO VERIFY LEVEL IS UNLOCKED

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }
}