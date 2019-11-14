// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { join, times } from 'lodash';
import * as React from 'react';

import { OutcomeIcon } from './outcome-icon';
import { outcomeTypeSemantics } from './outcome-type';
import {
    allRequirementOutcomeTypes,
    RequirementOutcomeStats,
} from './requirement-outcome-type';

function getText(stats: RequirementOutcomeStats): string {
    function textForOutcome(outcomeType): string {
        const count = stats[outcomeType];
        const { pastTense } = outcomeTypeSemantics[outcomeType];
        return `${count} ${pastTense}`;
    }
    return join(allRequirementOutcomeTypes.map(textForOutcome), ', ');
}

export const OutcomeIconSet = NamedFC<RequirementOutcomeStats>(
    'OutcomeIconSet',
    props => {
        const text = getText(props);

        return (
            <div className="outcome-icon-set" title={text}>
                {allRequirementOutcomeTypes.map(outcomeType =>
                    times(props[outcomeType], index => (
                        <span
                            className={
                                'outcome-icon outcome-icon-' + outcomeType
                            }
                            key={`outcome-icon-index-${index}`}
                        >
                            <OutcomeIcon outcomeType={outcomeType} />
                        </span>
                    )),
                )}
                <span className="screen-reader-only">{text}</span>
            </div>
        );
    },
);
