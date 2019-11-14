// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { OutcomeIcon } from './outcome-icon';
import { OutcomeType, outcomeTypeSemantics } from './outcome-type';

interface OutcomeChipProps {
    outcomeType: OutcomeType;
    count: number;
}

export const OutcomeChip = NamedFC<OutcomeChipProps>('OutcomeChip', props => {
    const { outcomeType, count } = props;
    const { pastTense } = outcomeTypeSemantics[outcomeType];

    const text = `${count} ${pastTense}`;

    return (
        <span
            className={'outcome-chip outcome-chip-' + outcomeType}
            title={text}
        >
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
