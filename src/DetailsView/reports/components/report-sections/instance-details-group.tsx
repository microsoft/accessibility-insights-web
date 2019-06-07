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
        <ul className="instance-details-list">
            {props.nodeResults.map((node, index) => (
                <li>
                    <InstanceDetails key={`instance-details-${index}`} {...{ index, ...node }} />
                </li>
            ))}
        </ul>
    );
});
