// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { SimpleCardRow } from './simple-card-row';

export const HowToCheckWebCardRow = NamedFC<CardRowProps>(
    'HowToCheckWebCardRow',
    ({ ...props }) => {
        return (
            <SimpleCardRow
                label="How to check"
                content="content for how to check"
                rowKey={`how-to-check-row-${props.index}`}
            />
        );
    },
);
