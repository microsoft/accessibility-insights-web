// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeIcon } from './outcome-icon';
import { OutcomeType, outcomeTypeSemantics } from './outcome-type';

interface OutcomeChipProps {
    outcomeType: OutcomeType;
    count: number;
}

export const OutcomeChip = NamedSFC<OutcomeChipProps>('OutcomeChip', props => {
    const { outcomeType, count } = props;
    const { pastTense } = outcomeTypeSemantics[outcomeType];

    const text = `${count} ${pastTense}`;

    return (
        <span className={'outcome-chip outcome-chip-' + outcomeType} title={text}>
            <span className="icon">
                <OutcomeIcon outcomeType={outcomeType} />
            </span>
            <span className="count" aria-hidden="true">
                {' '}
                {count}
            </span>
            <span className="screen-reader-only">{text}</span>
        </span>
    );
});
