// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeChip } from './outcome-chip';
import { allOutcomeTypes, OutcomeStats } from './outcome-type';

export const OutcomeChipSet = NamedSFC<OutcomeStats>('OutcomeChipSet', props => (
    <div className="outcome-chip-set">
        {allOutcomeTypes.map(outcomeType =>
            props[outcomeType] ? <OutcomeChip key={outcomeType} outcomeType={outcomeType} count={props[outcomeType]} /> : null,
        )}
    </div>
));
