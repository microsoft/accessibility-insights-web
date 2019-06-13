// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { InstanceDetails } from './instance-details';

export type InstanceDetailsGroupProps = {
    fixInstructionProcessor: FixInstructionProcessor;
    nodeResults: AxeNodeResult[];
};

export const InstanceDetailsGroup = NamedSFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    return (
        <ul className="instance-details-list" aria-label="failed instances with path, snippet and how to fix information">
            {props.nodeResults.map((node, index) => (
                <li>
                    <InstanceDetails
                        key={`instance-details-${index}`}
                        {...{ index, ...node, fixInstructionProcessor: props.fixInstructionProcessor }}
                    />
                </li>
            ))}
        </ul>
    );
});
