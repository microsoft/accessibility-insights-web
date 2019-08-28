// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedSFC } from '../../../common/react/named-sfc';
import { CardRow } from './card-row';

export interface StringPropertyCardRowProps extends CardRowProps {
    propertyData: string;
}

export const GetLabelledStringPropertyCardRow = (label: string) => {
    return NamedSFC<StringPropertyCardRowProps>('StringPropertyCardRowProps', props => {
        return <CardRow label={label} content={props.propertyData} rowKey={`${label}-${props.index}`} />;
    });
};
