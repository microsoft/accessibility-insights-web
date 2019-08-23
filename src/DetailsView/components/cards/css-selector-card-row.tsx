// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedSFC } from '../../../common/react/named-sfc';
import { TableRow } from './table-row';

export interface StringPropertyCardRowProps extends CardRowProps {
    propertyData: string;
}

export interface LabelledTableRowProps {
    label: string;
}

export const LabelledTableRow = (label: string) => {
    return NamedSFC<StringPropertyCardRowProps>('StringPropertyCardRowProps', props => {
        return <TableRow label={label} content={props.propertyData} rowKey={`${label}-${props.index}`} />;
    });
};
