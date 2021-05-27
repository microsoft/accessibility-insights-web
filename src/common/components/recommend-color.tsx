// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const MAXCOLORCOMPONENT : number = 255;
const MINCOLORCOMPONENT : number = 0;

export class RecommendColor{
    private _sentence: string;

    constructor(fore: string, back: string, contrast: number){
        this._sentence = this.recommend(this.hexToRGB(fore), this.hexToRGB(back), contrast);
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
        var result : any  = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    }

    //gets the luminence 
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
        for(let i = 0; i < 3; i++){
            let component : number = color[i];
            if(component * num <= MAXCOLORCOMPONENT && component * num >= MINCOLORCOMPONENT){
                color[i] = Math.floor(component*num);
            } else if(shade){
                color[i] = MAXCOLORCOMPONENT;
            } else {
                color[i] = MINCOLORCOMPONENT;
            }
        }
        return color;
    }

    private recommendAColor(contrast : number, toBeChanged : number[] , originalPair : number, toLightenDarken : boolean, colorContrast: number) : object{
        let preContrast : number = -1;
        while(contrast < colorContrast && contrast !== preContrast){
            preContrast = contrast;
            toBeChanged = this.darkenLighten(toBeChanged, toLightenDarken);
            if(toLightenDarken){
                contrast = (this.getLuminance(toBeChanged) + .05) / (originalPair + .05);
            } else {
                contrast = (originalPair + .05) / (this.getLuminance(toBeChanged) + .05);
            }
        }
        return [toBeChanged, contrast];
    }

    private recommend(fore : number[], back : number[], colorContrast: number){
        /**
         * TODO: look into font size to recommend the right colors
         * with the right ratios
         */
        let lighter : number, darker : number, contrast : number;      
        let foreLum = this.getLuminance(fore);
        let backLum = this.getLuminance(back);  
        //set the luminance and get contrast
        lighter = Math.max(foreLum, backLum);
        darker = lighter === foreLum? backLum: foreLum;
        contrast = (lighter + .05) / (darker + .05);

        //set the corresponding color to be lighter or darker shade
        let lightened : number[], darkened : number[];
        if(lighter === foreLum){
            lightened = fore;
            darkened = back;
        } else {
            lightened = back;
            darkened = fore;
        }
        let recommendLightened: object, recommendDarkened: object;
        //recommending a color
        
        recommendLightened = this.recommendAColor(contrast, lightened, darker, true, colorContrast);
        recommendDarkened = this.recommendAColor(contrast, darkened, lighter, false, colorContrast);
                
        let sentence : string = "", foreRec: string, backRec:string;

        if(lighter === foreLum){
            if(lightened[1] > colorContrast){
                foreRec = this.rgbToHex(recommendLightened[0][0], recommendLightened[0][1], recommendLightened[0][2]);
                sentence = " Use foreground color: " + foreRec + " (with original background color ratio is: "+ recommendLightened[1].toFixed(2) + ") to meet expected contrast ratio.";
            } 
            if(darkened[1] > colorContrast){
                backRec = this.rgbToHex(recommendDarkened[0][0], recommendDarkened[0][1], recommendDarkened[0][2]);
                sentence = sentence + " Use background color: " + backRec + " (with original foreground color ratio is: "+ recommendDarkened[1].toFixed(2) + ") to meet expected contrast ratio.";
            } 
        } else {
            if(darkened[1] > colorContrast){
                foreRec = this.rgbToHex(recommendDarkened[0][0], recommendDarkened[0][1], recommendDarkened[0][2]);
                sentence = " Use foreground color: " + foreRec + " (with original background color ratio is: "+ recommendDarkened[1].toFixed(2) + ") to meet expected contrast ratio.";
            } 
            if(lightened[1] > colorContrast){
                backRec = this.rgbToHex(recommendLightened[0][0], recommendLightened[0][1], recommendLightened[0][2]);
                sentence = sentence + " Use background color: " + backRec + " (with original foreground color ratio is: "+ recommendLightened[1].toFixed(2) + ") to meet expected contrast ratio.";
            } 
        } 
        return sentence;
    } 
}

    