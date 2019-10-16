// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Term } from 'assessments/markup';
import { FormattedResolution } from 'common/types/store-data/unified-data-interface';
import { isEmpty, isNil } from 'lodash';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { SimpleCardRow } from './simple-card-row';

export interface HowToFixAndroidCardRowProps extends CardRowProps {
    propertyData: FormattedResolution;
}

export const HowToFixAndroidCardRow = NamedFC<HowToFixAndroidCardRowProps>('HowToFixAndroidCardRow', props => {
    return (
        <SimpleCardRow
            label="How to fix"
            content={<>{getHowToFixContent(props)}</>}
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
    let howToFixSplit: HowToFixSplit[] = [{ str: propertyData.howToFix }];

    if (!isEmpty(propertyData.formatAsCode)) {
        propertyData.formatAsCode.forEach(item => {
            howToFixSplit = getHowToFixSplitsForPattern(item, howToFixSplit);
        });
    }

    return howToFixSplit.map((item, index) => {
        return isNil(item.str) ? <Term key={`strong-how-to-fix-${props.index}-${index}`}>{item.match}</Term> : item.str;
    });
}

function getHowToFixSplitsForPattern(pattern: string, previousHowToFixSplit: HowToFixSplit[]): HowToFixSplit[] {
    const newHowToFixSplit: HowToFixSplit[] = [];

    previousHowToFixSplit.forEach(prop => {
        if (!isNil(prop.str)) {
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
        } else {
            newHowToFixSplit.push({
                match: prop.match,
            });
        }
    });

    return newHowToFixSplit;
}
