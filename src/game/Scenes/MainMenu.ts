import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2d/Nodes/UIElements/Button";
import LevelSelection from "./LevelSelection";
import Input from "../../Wolfie2D/Input/Input";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private credits: Layer;
    static unlocked: Array<Boolean>;

    loadScene(){}

    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        const mainMenuHeader = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 250), text: "Calm The Calamities"});
        mainMenuHeader.textColor = Color.BLACK;
        mainMenuHeader.fontSize = 50;

        // Add play button, and give it an event to emit on press
        const play = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Start"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.BLACK;
        play.backgroundColor = new Color(0,255,213);
        play.textColor = Color.BLACK;
        play.onClickEventId = "play";

        // Add about button
        const about = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Help"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.BLACK;
        about.backgroundColor = new Color(0,255,213);
        about.textColor = Color.BLACK;
        about.onClickEventId = "about";

        // Add controls button
        const control = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        control.size.set(200, 50);
        control.borderWidth = 2;
        control.borderColor = Color.BLACK;
        control.backgroundColor = new Color(0,255,213);
        control.textColor = Color.BLACK;
        control.onClickEventId = "control";

        const credits = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 200), text: "Credits"});
        credits.size.set(200, 50);
        credits.borderWidth = 2;
        credits.borderColor = Color.BLACK;
        credits.backgroundColor = new Color(0,255,213);
        credits.textColor = Color.BLACK;
        credits.onClickEventId = "credits";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "Help"});
        aboutHeader.textColor = Color.BLACK;
        aboutHeader.fontSize = 50;

        const text1 = "You are a young god who just finished creating your first";
        const text2 = "world. You feel tired after making the world so you decided";
        const text3 = "to take a nap. The nap turns into a millennium long slumber.";
        const text4 = "While you were asleep, your powers leaked out from your";
        const text5 = "body into your world. They took the shape of violent spirits,";
        const text6 = "creating all kinds of natural disasters throughout your world."
        const text7 = "CHEATS (Use on Main Menu/Level Select):";
        const text8 = "Y - Unlock All Levels";
        const text9 = "U - Unlock All Elemental Skills";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 150), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 100), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 100), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x - 100, center.y + 150), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x + 150, center.y + 200), text: text8});
        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x + 200, center.y + 250), text: text9});

        line1.textColor = Color.BLACK;
        line2.textColor = Color.BLACK;
        line3.textColor = Color.BLACK;

        const aboutBack = <Button>this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.BLACK;
        aboutBack.backgroundColor = new Color(0,255,213);
        aboutBack.textColor = Color.BLACK;
        aboutBack.onClickEventId = "menu";

        /* ########## CONTROLS SCREEN ########## */
        this.control = this.addUILayer("control");
        this.control.setHidden(true);

        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        controlHeader.textColor = Color.BLACK;
        controlHeader.fontSize = 50;

        const ctext1 = "W - Move Up";
        const ctext2 = "A - Move Left";
        const ctext3 = "S - Move Down";
        const ctext4 = "D - Move Right";
        const ctext5 = "1,2,3,4,5 - Switch to Element 1-5";
        const ctext6 = "J - Interact With Element";
        const ctext7 = "K - Place/Remove Element";
        const ctext8 = "ESCAPE - Pause";

        const cline1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 150), text: ctext1});
        const cline2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 100), text: ctext2});
        const cline3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 50), text: ctext3});
        const cline4 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y), text: ctext4});
        const cline5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 50), text: ctext5});
        const cline6 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: ctext6});
        const cline7 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 150), text: ctext7});
        const cline8 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 200), text: ctext8});

        const controlBack = <Button>this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        controlBack.size.set(200, 50);
        controlBack.borderWidth = 2;
        controlBack.borderColor = Color.BLACK;
        controlBack.backgroundColor = new Color(0,255,213);
        controlBack.textColor = Color.BLACK;
        controlBack.onClickEventId = "menu";

        /* ########## CREDITS SCREEN ########## */
        this.credits = this.addUILayer("credits");
        this.credits.setHidden(true);

        const creditsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "credits", {position: new Vec2(center.x, center.y - 250), text: "Credits"});
        creditsHeader.textColor = Color.BLACK;
        creditsHeader.fontSize = 50;

        const crtext1 = "This game was made by:";
        const crtext2 = "David Silverman";
        const crtext3 = "Wei Hang Hong";
        const crtext4 = "Jiwon Jang";

        const crline1 = <Label>this.add.uiElement(UIElementType.LABEL, "credits", {position: new Vec2(center.x, center.y - 100), text: crtext1});
        const crline2 = <Label>this.add.uiElement(UIElementType.LABEL, "credits", {position: new Vec2(center.x, center.y), text: crtext2});
        const crline3 = <Label>this.add.uiElement(UIElementType.LABEL, "credits", {position: new Vec2(center.x, center.y + 50), text: crtext3});
        const crline4 = <Label>this.add.uiElement(UIElementType.LABEL, "credits", {position: new Vec2(center.x, center.y + 100), text: crtext4});

        crline1.textColor = Color.BLACK;
        crline2.textColor = Color.BLACK;
        crline3.textColor = Color.BLACK;
        crline4.textColor = Color.BLACK;

        const creditsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "credits", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        creditsBack.size.set(200, 50);
        creditsBack.borderWidth = 2;
        creditsBack.borderColor = Color.BLACK;
        creditsBack.backgroundColor = new Color(0,255,213);
        creditsBack.textColor = Color.BLACK;
        creditsBack.onClickEventId = "menu";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");
        this.receiver.subscribe("credits");

        if (!MainMenu.unlocked) MainMenu.unlocked = new Array(9).fill(false);
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

            if(event.type === "play"){
                this.sceneManager.changeToScene(LevelSelection, {});
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.credits.setHidden(true);
            }
            if(event.type === "control"){
                this.mainMenu.setHidden(true);
                this.control.setHidden(false);
            }

            if (event.type === "credits") {
                this.mainMenu.setHidden(true);
                this.credits.setHidden(false);
            }
        }
    }
}