// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import * as React from 'react';
import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { SimpleCardRow } from './simple-card-row';

export interface StringPropertyCardRowProps extends CardRowProps {
    propertyData: string;
}

export const GetLabelledStringPropertyCardRow = (
    label: string,
    contentClassName?: string,
) => {
    return NamedFC<StringPropertyCardRowProps>(
        'StringPropertyCardRowProps',
        props => {
            if (isEmpty(props.propertyData)) {
                return null;
            }

            return (
                <SimpleCardRow
                    label={label}
                    content={props.propertyData}
                    rowKey={`${label}-${props.index}`}
                    contentClassName={contentClassName}
                />
            );
        },
    );
};
