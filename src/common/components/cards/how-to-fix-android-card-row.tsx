// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Term } from 'assessments/markup';
import { FormattableResolution } from 'common/types/store-data/unified-data-interface';
import { isEmpty } from 'lodash';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { SimpleCardRow } from './simple-card-row';

export interface HowToFixAndroidCardRowProps extends CardRowProps {
    propertyData: FormattableResolution;
}

export const HowToFixAndroidCardRow = NamedFC<HowToFixAndroidCardRowProps>('HowToFixAndroidCardRow', props => {
    return (
        <SimpleCardRow
            label="How to fix"
            content={<span>{getHowToFixContent(props)}</span>}
            rowKey={`how-to-fix-row-${props.index}`}
            contentClassName="how-to-fix-card-row"
        />
    );
});

type HowToFixSplit = {
    str?: string;
    match?: string;
};

function getHowToFixContent(props: HowToFixAndroidCardRowProps): (JSX.Element | string)[] {
    const propertyData = props.propertyData;
    if (isEmpty(propertyData.howToFix)) {
        return [];
    }

    let howToFixSplit: HowToFixSplit[] = [{ str: propertyData.howToFix }];
    const result: (JSX.Element | string)[] = [];

    if (!isEmpty(propertyData.formatAsCode)) {
        propertyData.formatAsCode.forEach(item => {
            if (isEmpty(item)) {
                throw 'pattern cannot be empty';
            }

            howToFixSplit = getHowToFixSplitsForPattern(item, howToFixSplit);
        });
    }

    howToFixSplit.forEach((item, index) => {
        const key = `strong-how-to-fix-${props.index}-${index}`;
        const content = isEmpty(item.str) ? item.match : item.str;

        if (content[0] === ' ' && index !== 0) {
            result.push(<span key={key + '-before-space'}>&nbsp;</span>);
        }

        result.push(
            isEmpty(item.str) ? (
                <Term key={key}>{content}</Term>
            ) : (
                <span key={key}>{props.deps.fixInstructionProcessor.process(content)}</span>
            ),
        );

        if (content[content.length - 1] === ' ') {
            result.push(<span key={key + '-after-space'}>&nbsp;</span>);
        }
    });

    return result;
}

function getHowToFixSplitsForPattern(pattern: string, previousHowToFixSplit: HowToFixSplit[]): HowToFixSplit[] {
    const newHowToFixSplit: HowToFixSplit[] = [];

    previousHowToFixSplit.forEach(prop => {
        if (!isEmpty(prop.str)) {
            let str = prop.str;

            while (str.length > 0 && str.indexOf(pattern) >= 0) {
                const startIndex = str.indexOf(pattern);

                if (startIndex > 0) {
                    newHowToFixSplit.push({
                        str: str.substr(0, startIndex),
                    });
                }
                newHowToFixSplit.push({
                    match: pattern,
                });

                str = str.substr(startIndex + pattern.length);
            }

            if (str.length > 0) {
                newHowToFixSplit.push({
                    str: str,
                });
            }
        } else if (!isEmpty(prop.match)) {
            newHowToFixSplit.push({
                match: prop.match,
            });
        }
    });

    return newHowToFixSplit;
}
