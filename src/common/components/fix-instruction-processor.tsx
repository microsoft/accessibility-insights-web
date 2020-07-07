// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as styles from './cards/fix-instruction-color-box.scss';

type ColorMatch = {
    splitIndex: number;
    colorHexValue: string;
};

export class FixInstructionProcessor {
    private readonly colorValueMatcher = `(#[0-9a-f]{6})`;
    private readonly foregroundColorText = 'foreground color: ';
    private readonly foregroundRegExp = new RegExp(
        `${this.foregroundColorText}${this.colorValueMatcher}`,
        'i',
    );
    private readonly backgroundColorText = 'background color: ';
    private readonly backgroundRegExp = new RegExp(
        `${this.backgroundColorText}${this.colorValueMatcher}`,
        'i',
    );

    public process(fixInstruction: string): JSX.Element {
        const matches = this.getColorMatches(fixInstruction);
        return this.splitFixInstruction(fixInstruction, matches);
    }

    private getColorMatches(fixInstruction: string): ColorMatch[] {
        const foregroundMatch = this.getColorMatch(fixInstruction, this.foregroundRegExp);
        const backgroundMatch = this.getColorMatch(fixInstruction, this.backgroundRegExp);

        return [foregroundMatch, backgroundMatch].filter(match => match != null) as ColorMatch[];
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

        return {
            splitIndex: match.index + this.foregroundColorText.length + colorHexValue.length,
            colorHexValue,
        };
    }

    private splitFixInstruction(fixInstruction: string, matches: ColorMatch[]): JSX.Element {
        const sortedMatches = matches.sort((a, b) => a.splitIndex - b.splitIndex);

        if (sortedMatches.length === 0) {
            return <>{fixInstruction}</>;
        }

        let insertionIndex = 0;
        let keyIndex = 0;

        const result: JSX.Element[] = [];

        sortedMatches.forEach(match => {
            const endIndex = match.splitIndex - match.colorHexValue.length;
            const substring = fixInstruction.substring(insertionIndex, endIndex);

            result.push(<span key={`instruction-split-${keyIndex++}`}>{substring}</span>);

            result.push(this.createColorBox(match.colorHexValue, keyIndex++));

            insertionIndex = endIndex;
        });

        const coda = fixInstruction.substr(insertionIndex);

        result.push(<span key={`instruction-split-${keyIndex++}`}>{coda}</span>);

        return (
            <>
                <span aria-hidden="true">{result}</span>
                <span className={styles.screenReaderOnly}>{fixInstruction}</span>
            </>
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
