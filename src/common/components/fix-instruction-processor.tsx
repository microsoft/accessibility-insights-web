// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import styles from './cards/fix-instruction-color-box.scss';

type ColorMatch = {
    splitIndex: number;
    colorHexValue: string;
};

export const recommendationsAutomationId = 'recommendations';

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
    // eslint-disable-next-line security/detect-non-literal-regexp
    private readonly foregroundRecommendedRegExp = new RegExp(
        `${this.foregroundRecommendedColorText}${this.colorValueMatcher}`,
        'i',
    );
    private readonly backgroundRecommendedColorText = 'Use background color: ';
    // eslint-disable-next-line security/detect-non-literal-regexp
    private readonly backgroundRecommendedRegExp = new RegExp(
        `${this.backgroundRecommendedColorText}${this.colorValueMatcher}`,
        'i',
    );

    private readonly contrastRatioText = 'Expected contrast ratio of ';
    // eslint-disable-next-line security/detect-non-literal-regexp
    private readonly contrastRatioRegExp = new RegExp(`${this.contrastRatioText}`, 'i');
    private readonly originalMiddleSentence = ' and the original foreground color: ';

    public process(fixInstruction: string, recommendColor: RecommendColor): JSX.Element {
        fixInstruction = fixInstruction.replace(/\(see related nodes\)/g, '(see related paths)');

        const matches = this.getColorMatches(fixInstruction);

        let recommendationSentences: string[] = [];
        if (matches.length === 2 && fixInstruction != null) {
            recommendationSentences = this.getColorRecommendations(
                fixInstruction,
                matches,
                recommendColor,
            );
        }
        return this.splitFixInstruction(fixInstruction, recommendationSentences, matches);
    }

    private getColorRecommendations(
        fixInstruction: string,
        matches: ColorMatch[],
        recommendColor: RecommendColor,
    ) {
        const sentenceDivider = '. ';
        let contrastRatio: number = 4.5;

        const regularExpExpectation = this.contrastRatioRegExp.exec(fixInstruction);
        if (regularExpExpectation != null) {
            const indexContrast = regularExpExpectation.index;
            const contrastIndex = fixInstruction.substring(
                indexContrast + this.contrastRatioText.length,
            );
            contrastRatio = parseFloat(contrastIndex.substring(0, contrastIndex.indexOf(':')));
        }

        const recommendSentence = recommendColor.getRecommendColor(
            matches[0].colorHexValue,
            matches[1].colorHexValue,
            contrastRatio,
        );

        const recommendationSentences = recommendSentence.split(sentenceDivider);

        this.getRecommendedColorMatches(recommendationSentences[0], matches);
        if (recommendationSentences.length === 1) {
            return recommendationSentences;
        }

        this.getRecommendedColorMatches(recommendationSentences[1], matches);
        return recommendationSentences;
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

    private splitFixInstruction(
        fixInstruction: string,
        recommendationStrings: string[],
        matches: ColorMatch[],
    ): JSX.Element {
        if (matches.length === 0) {
            return <>{fixInstruction}</>;
        }

        const recommendations: JSX.Element[] = [];
        const howToFixMatches = matches.slice(0, 2);
        const recommendationMatches = matches.slice(2);

        const results = this.getInstructionWithAndWithoutBoxes(howToFixMatches, fixInstruction);

        if (recommendationStrings.length === 0) {
            return <>{results}</>;
        }

        const recommendationOne = this.getInstructionWithAndWithoutBoxes(
            recommendationMatches.slice(0, 2),
            recommendationStrings[0],
        );

        recommendations.push(recommendationOne);

        if (recommendationStrings.length > 1) {
            const recommendationTwo = this.getInstructionWithAndWithoutBoxes(
                recommendationMatches.slice(2),
                recommendationStrings[1],
            );
            recommendations.push(recommendationTwo);
        }

        return this.addRecommendationsToResults(results, recommendations);
    }

    private addRecommendationsToResults(results: JSX.Element, recommendations: JSX.Element[]) {
        return (
            <>
                {results}
                <ul key="recommendations-list" data-automation-id={recommendationsAutomationId}>
                    {recommendations.map((rec, idx) => (
                        <li key={`recommendation-${idx}`}>{rec}</li>
                    ))}
                </ul>
            </>
        );
    }

    private getInstructionWithBoxes(matches: ColorMatch[], fixInstruction: string) {
        let insertionIndex = 0;
        let keyIndex = 0;
        const result: JSX.Element[] = [];

        matches.forEach(match => {
            const endIndex = match.splitIndex - match.colorHexValue.length;
            const substring = fixInstruction.substring(insertionIndex, endIndex);

            result.push(<span key={`instruction-split-${keyIndex++}`}>{substring}</span>);
            result.push(this.createColorBox(match.colorHexValue, keyIndex++));

            insertionIndex = endIndex;
        });

        const coda = fixInstruction.substr(insertionIndex);

        result.push(<span key={`instruction-split-${keyIndex++}`}>{coda}</span>);
        return result;
    }

    private getInstructionWithAndWithoutBoxes(matches: ColorMatch[], fixInstruction: string) {
        // this is necessary to ensure Narrator reads the instruction without pauses
        return (
            <>
                <span aria-hidden="true">
                    {this.getInstructionWithBoxes(matches, fixInstruction)}
                </span>
                <span className={styles.screenReaderOnly}>{fixInstruction}</span>
            </>
        );
    }

    private createColorBox(colorHexValue: string, keyIndex: number): JSX.Element {
        return (
            <span
                aria-hidden={true}
                key={`instruction-split-${keyIndex}`}
                className={styles.fixInstructionColorBox}
                style={{ backgroundColor: colorHexValue }}
            />
        );
    }
}
