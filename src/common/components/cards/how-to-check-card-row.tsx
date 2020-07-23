// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToCheckText } from 'common/components/cards/how-to-check-text';
import * as React from 'react';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { SimpleCardRow } from './simple-card-row';

export interface HowToCheckWebPropertyData {
    ruleId: string;
}

export interface HowToCheckWebCardRowProps extends CardRowProps {
    propertyData: HowToCheckWebPropertyData;
}

export const HowToCheckWebCardRow = NamedFC<CardRowProps>(
    'HowToCheckWebCardRow',
    ({ ...props }) => {
        return (
            <SimpleCardRow
                label="How to check"
                content={<HowToCheckText id={props.propertyData} />}
                rowKey={`how-to-check-row-${props.index}`}
            />
        );
    },
);
