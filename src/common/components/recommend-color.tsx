// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const MAXCOLORCOMPONENT : number = 255;
const MINCOLORCOMPONENT : number = 0;

export class RecommendColor{
    fore: number[];
    back: number[];
    foreLum: number;
    backLum: number;
    private _foreRec: string; 
    private _backRec: string;
    private _sentence: string;

    constructor(fore: string, back: string){
        this.fore = this.hexToRGB(fore);
        this.back = this.hexToRGB(back);
        this.foreLum = this.getLuminance(this.fore);
        this.backLum = this.getLuminance(this.back);
        this._sentence = this.recommend(this.fore, this.back);
    }
    
    public get foreRec(): string {
        return this._foreRec;
    }

    public get backRec(): string {
        return this._backRec;
    }
    
    public get sentence(): string {
        return this._sentence;
    }
    //converts rgb to hex
    private rgbToHex(r : number,g : number,b : number) : string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } 

    //converts hex to rgb
    private hexToRGB(hex : string) : number[]  {
        console.log(hex);
        var result : any  = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        console.log(result);
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    }

    //gets the luminence first
    private getLuminance(color : number[] ) : number {
        const a = [color[0], color[1], color[2]].map(function (v){
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
        });
        return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
    }

    private darkenLighten (color : number[], shade : boolean) : number[] {
        //shade = true lighten
        //shade = false darken
        let num : number = .95;
        if(shade){
            num = 1.05;
            if(color[0]===0 && color[1]===0 && color[2]===0){
                color = [10,10,10];
            }
        } 
        //console.log(color + "Shade" + shade)
        for(let i = 0; i < 3; i++){
            let component : number = color[i];
            //console.log("Component" + component + "num " + num + "=" + component * num);
            if(component * num <= MAXCOLORCOMPONENT && component * num >= MINCOLORCOMPONENT){
                color[i] = Math.floor(component*num);
            } else if(shade){
                color[i] = MAXCOLORCOMPONENT;
            } else {
                color[i] = MINCOLORCOMPONENT;
            }
        }
        //console.log(color);
        return color;
    }

    private recommendAColor(contrast : number, toBeChanged : number[] , originalPair : number, toLightenDarken : boolean) : object{
        let preContrast : number = -1;
        while(contrast < 4.5 && contrast !== preContrast){
            preContrast = contrast;
            //console.log("Contrast: " + contrast + " ColorToBeChanged: " + toBeChanged);
            toBeChanged = this.darkenLighten(toBeChanged, toLightenDarken);
            if(toLightenDarken){
                contrast = (this.getLuminance(toBeChanged) + .05) / (originalPair + .05);
            } else {
                contrast = (originalPair + .05) / (this.getLuminance(toBeChanged) + .05);
            }
        }
        return [toBeChanged, contrast];
    }

    private recommend(fore : number[], back : number[]){
        /**
         * TODO: look into font size to recommend the right colors
         * with the right ratios
         */
        let lighter : number, darker : number, contrast : number;
        //determine the luminance
        
        //set the luminance and get contrast
        lighter = Math.max(this.foreLum, this.backLum);
        darker = lighter === this.foreLum? this.backLum: this.foreLum;
        contrast = (lighter + .05) / (darker + .05);

        //set the corresponding color to be lighter or darker shade
        let lightened : any, darkened : any;
        if(lighter === this.foreLum){
            lightened = fore;
            darkened = back;
            console.log("lighter Color: " + fore + " Darker Color: " + back);
        } else {
            lightened = back;
            darkened = fore;
            console.log("lighter Color: " + back + " Darker Color: " + fore);
        }
        
        //recommending a color
        //console.log("LIGHTEN");
        lightened = this.recommendAColor(contrast, lightened, darker, true);
        //console.log("DARKEN");
        darkened = this.recommendAColor(contrast, darkened, lighter, false);
        
        //prints to check work
        //console.log("Contrast: " + contrast);
        //console.log("Foreground: " + fore + " Background: " + back);

        //setting the color to be able to see it in the web
        //let rgbToHex(lightened[0][0], lightened[0][1], lightened[0][2]))
        //setDarkened(rgbToHex(darkened[0][0], darkened[0][1], darkened[0][2]));
        
        let sentence : string = "";

        if(lighter === this.foreLum){
            //console.log("Lighter Color: " + fore + " Recommended Darkened Color: " + darkened);
            //console.log("Darker Color:  " + back + " Recommended Lighter Color:  " + lightened); 
            if(lightened[1] > 4.5){
                this._foreRec = this.rgbToHex(lightened[0][0], lightened[0][1], lightened[0][2]);
                sentence = " Use foreground color: " + this._foreRec + " (with original background color ratio is: "+ lightened[1].toFixed(2) + ").";
            } 
            if(darkened[1] > 4.5){
                this._backRec = this.rgbToHex(darkened[0][0], darkened[0][1], darkened[0][2]);
                sentence = sentence + " Use background color: " + this._backRec + " (with original foreground color ratio is: "+ darkened[1].toFixed(2) + ") to meet the expected contrast ratio.";
            } 

        } else {
            //console.log("Lighter Color: " + back + " Recommended Darkened Color: " + darkened);
            //console.log("Darker Color:  " + fore + " Recommended Lighter Color:  " + lightened);
            if(darkened[1] > 4.5){
                this._foreRec = this.rgbToHex(darkened[0][0], darkened[0][1], darkened[0][2]);
                sentence = " Use foreground color: " + this._foreRec + " (with original background color ratio is: "+ darkened[1].toFixed(2) + ").";
            } 
            if(lightened[1] > 4.5){
                this._backRec = this.rgbToHex(lightened[0][0], lightened[0][1], lightened[0][2]);
                sentence = sentence + " Use background color: " + this._backRec + " (with original foreground color ratio is: "+ lightened[1].toFixed(2) + ") to meet the expected contrast ratio.";
            } 
        } 

        return sentence;
    } 
}

    