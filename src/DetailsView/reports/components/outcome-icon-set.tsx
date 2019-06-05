// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { join, times } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeIcon } from './outcome-icon';
import { allRequirementOutcomeTypes, OutcomeStats, outcomeTypeSemantics } from './requirement-outcome-type';

function getText(stats: OutcomeStats): string {
    function textForOutcome(outcomeType): string {
        const count = stats[outcomeType];
        const { pastTense } = outcomeTypeSemantics[outcomeType];
        return `${count} ${pastTense}`;
    }
    return join(allRequirementOutcomeTypes.map(textForOutcome), ', ');
}

export const OutcomeIconSet = NamedSFC<OutcomeStats>('OutcomeIconSet', props => {
    const text = getText(props);

    return (
        <div className="outcome-icon-set" title={text}>
            {allRequirementOutcomeTypes.map(outcomeType =>
                times(props[outcomeType], index => (
                    <span className={'outcome-icon outcome-icon-' + outcomeType} key={`outcome-icon-index-${index}`}>
                        <OutcomeIcon outcomeType={outcomeType} />
                    </span>
                )),
            )}
            <span className="screen-reader-only">{text}</span>
        </div>
    );
});
