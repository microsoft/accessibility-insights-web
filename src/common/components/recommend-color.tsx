// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const MAXCOLORCOMPONENT: number = 255;
const MINCOLORCOMPONENT: number = 0;

export class RecommendColor {
    private _sentence: string;

    constructor(fore: string, back: string, contrast: number) {
        this._sentence = this.recommend(this.hexToRGB(fore), this.hexToRGB(back), contrast);
    }

    public get sentence(): string {
        return this._sentence;
    }

    private rgbToHex(r: number, g: number, b: number): string {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    private hexToRGB(hex: string): number[] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }

    private getLuminance(color: number[]): number {
        const a = [color[0], color[1], color[2]].map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    private darkenLighten(color: number[], shade: boolean): number[] {
        let num: number = 0.95;
        if (shade) {
            num = 1.05;
            if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
                color = [10, 10, 10];
            }
        }

        for (let i = 0; i < 3; i++) {
            let component: number = color[i];
            if (component * num <= MAXCOLORCOMPONENT && component * num >= MINCOLORCOMPONENT) {
                color[i] = Math.floor(component * num);
            } else if (shade) {
                color[i] = MAXCOLORCOMPONENT;
            } else {
                color[i] = MINCOLORCOMPONENT;
            }
        }

        return color;
    }

    private recommendAColor(
        contrast: number,
        toBeChanged: number[],
        originalPair: number,
        toLightenDarken: boolean,
        colorContrast: number,
    ): object {
        let preContrast: number = -1;

        while (contrast < colorContrast && contrast !== preContrast) {
            preContrast = contrast;
            toBeChanged = this.darkenLighten(toBeChanged, toLightenDarken);
            if (toLightenDarken) {
                contrast = (this.getLuminance(toBeChanged) + 0.05) / (originalPair + 0.05);
            } else {
                contrast = (originalPair + 0.05) / (this.getLuminance(toBeChanged) + 0.05);
            }
        }

        return [toBeChanged, contrast];
    }

    private recommend(fore: number[], back: number[], colorContrast: number) {
        let lighter: number, darker: number, contrast: number;
        let foreLum = this.getLuminance(fore);
        let backLum = this.getLuminance(back);
        lighter = Math.max(foreLum, backLum);
        darker = lighter === foreLum ? backLum : foreLum;
        contrast = (lighter + 0.05) / (darker + 0.05);

        let lightened: number[], darkened: number[];

        if (lighter === foreLum) {
            lightened = fore;
            darkened = back;
        } else {
            lightened = back;
            darkened = fore;
        }

        let recommendLightened: object, recommendDarkened: object;
        recommendLightened = this.recommendAColor(contrast, lightened, darker, true, colorContrast);
        recommendDarkened = this.recommendAColor(contrast, darkened, lighter, false, colorContrast);

        let sentence: string = '',
            foreRec: string,
            backRec: string;

        if (lighter === foreLum) {
            if (recommendLightened[1] > colorContrast) {
                foreRec = this.rgbToHex(
                    recommendLightened[0][0],
                    recommendLightened[0][1],
                    recommendLightened[0][2],
                );
                sentence =
                    ' Use foreground color: ' +
                    foreRec +
                    ' to meet a contrast ratio of ' +
                    recommendLightened[1].toFixed(2) +
                    ':1.';
            }
            if (recommendDarkened[1] > colorContrast) {
                backRec = this.rgbToHex(
                    recommendDarkened[0][0],
                    recommendDarkened[0][1],
                    recommendDarkened[0][2],
                );
                sentence =
                    sentence +
                    ' Use background color: ' +
                    backRec +
                    ' to meet a contrast ratio of ' +
                    recommendDarkened[1].toFixed(2) +
                    ':1.';
            }
        } else {
            if (recommendDarkened[1] > colorContrast) {
                foreRec = this.rgbToHex(
                    recommendDarkened[0][0],
                    recommendDarkened[0][1],
                    recommendDarkened[0][2],
                );
                sentence =
                    ' Use foreground color: ' +
                    foreRec +
                    ' to meet a contrast ratio of ' +
                    recommendDarkened[1].toFixed(2) +
                    ':1.';
            }
            if (recommendLightened[1] > colorContrast) {
                backRec = this.rgbToHex(
                    recommendLightened[0][0],
                    recommendLightened[0][1],
                    recommendLightened[0][2],
                );
                sentence =
                    sentence +
                    ' Use background color: ' +
                    backRec +
                    ' to meet a contrast ratio of ' +
                    recommendLightened[1].toFixed(2) +
                    ':1.';
            }
        }

        return sentence;
    }
}
