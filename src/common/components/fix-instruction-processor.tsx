// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import * as styles from './cards/fix-instruction-color-box.scss';

type ColorMatch = {
    splitIndex: number;
    colorHexValue: string;
};

export class FixInstructionProcessor {
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
    private readonly contrastRatioRegExp = new RegExp(`${this.contrastRatioText}`, 'i');
    private readonly originalMiddleSentence = ' and the original foreground color: ';

    private readonly recommendEndSentence = ' to meet a contrast ratio of #.##:1';

    public process(fixInstruction: string, recommendation: RecommendColor): JSX.Element {
        const matches = this.getColorMatches(fixInstruction);

        if (matches.length === 2 && fixInstruction != null) {
            fixInstruction = this.getColorRecommendation(fixInstruction, matches, recommendation);
        }
        return this.splitFixInstruction(fixInstruction, matches);
    }

    private getColorRecommendation(
        fixInstruction: string,
        matches: ColorMatch[],
        recommendation: RecommendColor,
    ) {
        let contrastRatio: number = 4.5;
        const regularExpExpectation = this.contrastRatioRegExp.exec(fixInstruction);
        if (regularExpExpectation != null) {
            const indexContrast = regularExpExpectation.index;
            const contrastIndex = fixInstruction.substring(
                indexContrast + this.contrastRatioText.length,
            );
            contrastRatio = parseFloat(contrastIndex.substring(0, contrastIndex.indexOf(':')));
        }

        if (recommendation.sentence !== 'Color suggestion text') {
            fixInstruction += recommendation.getRecommendColor(
                matches[0].colorHexValue,
                matches[1].colorHexValue,
                contrastRatio,
            );
            this.getRecommendedColorMatches(fixInstruction, matches);
        }

        return fixInstruction;
    }

    private getColorMatches(fixInstruction: string): ColorMatch[] {
        const foregroundMatch = this.getColorMatch(fixInstruction, this.foregroundRegExp);
        const backgroundMatch = this.getColorMatch(fixInstruction, this.backgroundRegExp);

        return [foregroundMatch, backgroundMatch].filter(match => match != null) as ColorMatch[];
    }

    private getRecommendedColorMatches(fixInstruction: string, matches: ColorMatch[]) {
        const foregroundRecommededMatch = this.getColorMatch(
            fixInstruction,
            this.foregroundRecommendedRegExp,
        );
        if (foregroundRecommededMatch !== null) {
            matches.push(foregroundRecommededMatch);
            matches.push(this.getOriginalColorMatch(fixInstruction, foregroundRecommededMatch));
        }

        const backgroundRecommededMatch = this.getColorMatch(
            fixInstruction,
            this.backgroundRecommendedRegExp,
        );
        if (backgroundRecommededMatch !== null) {
            matches.push(backgroundRecommededMatch);
            matches.push(this.getOriginalColorMatch(fixInstruction, backgroundRecommededMatch));
        }
    }

    private getColorMatch(fixInstruction: string, colorRegex: RegExp): ColorMatch | null {
        if (!colorRegex.test(fixInstruction)) {
            return null;
        }

        const match = colorRegex.exec(fixInstruction);

        if (match == null || match[1] == null) {
            return null;
        }

        const colorHexValue = match[1];

        if (
            colorRegex === this.foregroundRecommendedRegExp ||
            colorRegex === this.backgroundRecommendedRegExp
        ) {
            return {
                splitIndex:
                    match.index + this.foregroundRecommendedColorText.length + colorHexValue.length,
                colorHexValue,
            };
        }

        return {
            splitIndex: match.index + this.foregroundColorText.length + colorHexValue.length,
            colorHexValue,
        };
    }

    private getOriginalColorMatch(fixInstruction: string, match: ColorMatch): ColorMatch {
        const split = match.splitIndex + this.originalMiddleSentence.length;
        return {
            splitIndex: split + match.colorHexValue.length,
            colorHexValue: fixInstruction.substring(split, split + match.colorHexValue.length),
        };
    }

    private splitFixInstruction(fixInstruction: string, matches: ColorMatch[]): JSX.Element {
        const sortedMatches = matches.sort((a, b) => a.splitIndex - b.splitIndex);
        if (sortedMatches.length === 0) {
            return <>{fixInstruction}</>;
        }

        const insertionIndex = 0;
        const keyIndex = 0;

        const result: JSX.Element[] = [];
        if (matches.length >= 2) {
            this.bulletAndColorBoxOutput(
                sortedMatches,
                fixInstruction,
                insertionIndex,
                result,
                keyIndex,
            );
        }

        return (
            <>
                <span aria-hidden="true">{result}</span>
                <span className={styles.screenReaderOnly}>{fixInstruction}</span>
            </>
        );
    }

    private bulletAndColorBoxOutput(
        sortedMatches: ColorMatch[],
        fixInstruction: string,
        insertionIndex: number,
        result: JSX.Element[],
        keyIndex: number,
    ) {
        for (let i: number = 0; i < sortedMatches.length; i++) {
            const match: ColorMatch = sortedMatches[i];
            if (i === 0) {
                insertionIndex = 0;
            } else {
                insertionIndex =
                    match.splitIndex -
                    this.foregroundRecommendedColorText.length -
                    match.colorHexValue.length -
                    1;
                if (i > 2) {
                    insertionIndex -= 3;
                }
            }
            let colorEndIndex = match.splitIndex - match.colorHexValue.length;
            const beforeColorBox = fixInstruction.substring(insertionIndex, colorEndIndex);
            insertionIndex = colorEndIndex;
            i++;
            colorEndIndex = sortedMatches[i].splitIndex - match.colorHexValue.length;
            const middleSubstring = fixInstruction.substring(insertionIndex, colorEndIndex);
            insertionIndex = colorEndIndex;
            let endSubstring = '';
            if (i === 1) {
                endSubstring = fixInstruction.substring(
                    insertionIndex,
                    fixInstruction.indexOf(this.contrastRatioText) +
                        this.contrastRatioText.length +
                        6,
                );
                result.push(
                    <span key={`instruction-split-${keyIndex++}`}>
                        {this.addBulletPoint(
                            keyIndex,
                            beforeColorBox,
                            match,
                            middleSubstring,
                            sortedMatches,
                            i,
                            endSubstring,
                        )}
                    </span>,
                );
            } else {
                colorEndIndex = sortedMatches[i].splitIndex + this.recommendEndSentence.length;
                endSubstring = fixInstruction.substring(insertionIndex, colorEndIndex);
                result.push(
                    <span key={`instruction-split-${keyIndex++}`}>
                        <ul key={`instruction-split-${keyIndex++}`}>
                            <li key={`instruction-split-${keyIndex++}`}>
                                {this.addBulletPoint(
                                    keyIndex,
                                    beforeColorBox,
                                    match,
                                    middleSubstring,
                                    sortedMatches,
                                    i,
                                    endSubstring,
                                )}
                            </li>
                        </ul>
                    </span>,
                );
            }
        }
    }

    private addBulletPoint(
        keyIndex: number,
        beforeColorBox: string,
        match: ColorMatch,
        middleSubstring: string,
        sortedMatches: ColorMatch[],
        i: number,
        endSubstring: string,
    ): JSX.Element {
        return (
            <span key={`instruction-split-${keyIndex++}`}>
                {beforeColorBox}
                {this.createColorBox(match.colorHexValue, keyIndex++)}
                {middleSubstring}
                {this.createColorBox(sortedMatches[i].colorHexValue, keyIndex++)}
                {endSubstring}
            </span>
        );
    }

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
