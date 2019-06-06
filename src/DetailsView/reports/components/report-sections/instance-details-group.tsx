// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { InstanceDetails } from './instance-details';

export type InstanceDetailsGroupProps = {
    nodeResults: AxeNodeResult[];
};

export const InstanceDetailsGroup = NamedSFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    return (
        <>
            {props.nodeResults.map((node, index) => (
                <InstanceDetails key={`instance-details-${index}`} {...{ index, ...node }} />
            ))}
        </>
    );
});
