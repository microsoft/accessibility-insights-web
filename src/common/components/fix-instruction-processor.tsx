// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as styles from './cards/fix-instruction-color-box.scss';
import {RecommendColor} from 'common/components/recommend-color';

type ColorMatch = {
    splitIndex: number;
    //this is where the index will split the fixintsructions 
    //used in the splitFixInstruction
    colorHexValue: string;// i guess this is the color hex we need
};

export class FixInstructionProcessor {
    // The Following variables are for the REGEX. used in the getColorMatch function
    private readonly colorValueMatcher = `(#[0-9a-f]{6})`;
    private readonly foregroundColorText = 'foreground color: ';
    // the following warnings can be disabled because the values are actually constant strings and the string template is used merely for ease of reading
    // eslint-disable-next-line security/detect-non-literal-regexp
    private readonly foregroundRegExp = new RegExp(
        `${this.foregroundColorText}${this.colorValueMatcher}`,
        'i',
    );
    private readonly backgroundColorText = 'background color: ';
    // eslint-disable-next-line security/detect-non-literal-regexp
    private readonly backgroundRegExp = new RegExp(
        `${this.backgroundColorText}${this.colorValueMatcher}`,
        'i',
    );

    private readonly foregroundRecommendedColorText = 'Use foreground color: ';
    private readonly foregroundRecommendedRegExp = new RegExp(
        `${this.foregroundRecommendedColorText}${this.colorValueMatcher}`,
        'i',
    );
    private readonly backgroundRecommendedColorText = 'Use background color: ';
    private readonly backgroundRecommendedRegExp = new RegExp(
        `${this.backgroundRecommendedColorText}${this.colorValueMatcher}`,
        'i',
    );    

    private readonly contrastRatioText = 'Expected contrast ratio of ';
    private readonly contrastRatioRegExp = new RegExp(
        `${this.contrastRatioText}`,
        'i',
    );  
    /**
     * main function that gets called. called in fix-instruction-panel. 
     * 
     * @param fixInstruction string 
     * @returns 
     */
    public process(fixInstruction: string): JSX.Element {
        
        const matches = this.getColorMatches(fixInstruction);
        let contrastIndex = fixInstruction.substring(this.contrastRatioRegExp.exec(fixInstruction).index + this.contrastRatioText.length);
        const contrastRatio = contrastIndex.substring(0, contrastIndex.indexOf(":"));
        const recommendation = new RecommendColor(matches[0].colorHexValue, matches[1].colorHexValue, parseFloat(contrastRatio));
        fixInstruction += "." + recommendation.sentence;
        this.getRecommendedColorMatches(fixInstruction, matches);
        return this.splitFixInstruction(fixInstruction, matches);
    }

    /**
     * Next function that gets called. called by process
     * @param fixInstruction 
     * @returns 
     */
    private getColorMatches(fixInstruction: string): ColorMatch[] {
        const foregroundMatch = this.getColorMatch(fixInstruction, this.foregroundRegExp);
        const backgroundMatch = this.getColorMatch(fixInstruction, this.backgroundRegExp);
        
        return [foregroundMatch, backgroundMatch].filter(match => match != null) as ColorMatch[];
        //filter makes sure that there are no null values. 
    }

    private getRecommendedColorMatches(fixInstruction: string, matches: ColorMatch[]){
        const foregroundRecommededMatch = this.getColorMatch(fixInstruction, this.foregroundRecommendedRegExp);
        if(foregroundRecommededMatch !== null){
            matches.push(foregroundRecommededMatch);
        }

        const backgroundRecommededMatch = this.getColorMatch(fixInstruction, this.backgroundRecommendedRegExp);
        if(backgroundRecommededMatch !== null ){
            matches.push(backgroundRecommededMatch);
        }
    }

    /**
     * Third function that gets called. called by getColorMatches. 
     * Function that basically filters out the bad inputs. 
     * And gets the index
     * @param fixInstruction 
     * @param colorRegex 
     * @returns 
     */
    private getColorMatch(fixInstruction: string, colorRegex: RegExp): ColorMatch | null {
        if (!colorRegex.test(fixInstruction)) {
            return null;
        }

        const match = colorRegex.exec(fixInstruction);

        if (match == null || match[1] == null) {
            return null;
        }

        const colorHexValue = match[1];

        if(colorRegex === this.foregroundRecommendedRegExp || colorRegex === this.backgroundRecommendedRegExp){
            return {
                splitIndex: match.index + this.foregroundRecommendedColorText.length + colorHexValue.length,
                colorHexValue,
            };
        }
        
        return {
            splitIndex: match.index + this.foregroundColorText.length + colorHexValue.length,
            colorHexValue,
        };
    }

    /**
     * function called when returning
     * 
     * @param fixInstruction 
     * @param matches 
     * @returns 
     */
    private splitFixInstruction(fixInstruction: string, matches: ColorMatch[]): JSX.Element {
        //it makes sure that the matches are in order. 
        const sortedMatches = matches.sort((a, b) => a.splitIndex - b.splitIndex);
        console.log(fixInstruction);
        if (sortedMatches.length === 0) {
            return <>{fixInstruction}</>;
        }

        let insertionIndex = 0;
        let keyIndex = 0;

        const result: JSX.Element[] = [];

        /**
         * basically. fixInstructions is the whole instructions already like : 
         * Element has insufficient color contrast of 4.43 (foreground color: #2179d3, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). 
         * Expected contrast ratio of 4.5:1. 
         * 
         * The following algo is splitting up the instructions and adding the colored boxes. 
         */
        sortedMatches.forEach(match => {
            
            const endIndex = match.splitIndex - match.colorHexValue.length;//gets the substring end index
            const substring = fixInstruction.substring(insertionIndex, endIndex);//uses endindex and gets the substring

            result.push(<span key={`instruction-split-${keyIndex++}`}>{substring}</span>);

            result.push(this.createColorBox(match.colorHexValue, keyIndex++));

            insertionIndex = endIndex; // re-starts the index
        });

        const coda = fixInstruction.substr(insertionIndex);//rest of the instructions

        result.push(<span key={`instruction-split-${keyIndex++}`}>{coda}</span>);

        return (
            <>
                <span aria-hidden="true">{result}</span>
                <span className={styles.screenReaderOnly}>{fixInstruction}</span>
            </>
        );
    }

    /**
     * gets called by splitFixInstruction
     * @param colorHexValue 
     * @param keyIndex 
     * @returns 
     */
    private createColorBox(colorHexValue: string, keyIndex: number): JSX.Element {
        return (
            <span
                key={`instruction-split-${keyIndex}`}
                className={styles.fixInstructionColorBox}
                style={{ backgroundColor: colorHexValue }}
            />
        );
    }
}
