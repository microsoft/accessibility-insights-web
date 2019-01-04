// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { join, times } from 'lodash/index';
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeIcon } from './outcome-icon';
import { allOutcomeTypes, OutcomeStats, outcomeTypeSemantics } from './outcome-type';

function getText(stats: OutcomeStats) {
    function textForOutcome(outcomeType) {
        const count = stats[outcomeType];
        const { pastTense } = outcomeTypeSemantics[outcomeType];
        return `${count} ${pastTense}`;
    }
    return join(allOutcomeTypes.map(textForOutcome), ', ');
}

export const OutcomeIconSet = NamedSFC<OutcomeStats>('OutcomeIconSet', props => {
    const text = getText(props);

    return <div className="outcome-icon-set" title={text}>
        {allOutcomeTypes.map(outcomeType =>
            times(props[outcomeType], index => (
                <span className={'outcome-icon outcome-icon-' + outcomeType} key={`outcome-icon-index-${index}`}>
                    <OutcomeIcon outcomeType={outcomeType} />
                </span>
            )),
        )}
        <span className="screen-reader-only">{text}</span>
    </div>;
});

