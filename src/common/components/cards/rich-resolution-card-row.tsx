// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import { UnifiedRichResolution } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { RichResolutionContent } from './rich-resolution-content';
import { SimpleCardRow } from './simple-card-row';

export interface RichResolutionCardRowProps extends CardRowProps {
    propertyData: UnifiedRichResolution;
}

export const RichResolutionCardRow = NamedFC<CardRowProps>(
    'RichResolutionCardRow',
    ({ deps, index, propertyData }) => {
        return (
            <SimpleCardRow
                label={`How to ${propertyData.type}`}
                content={<RichResolutionContent deps={deps} {...propertyData} />}
                rowKey={`rich-resolution-row-${index}`}
            />
        );
    },
);
