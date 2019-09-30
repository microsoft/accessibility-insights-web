// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';

import { outcomeIconMap, OutcomeType } from './outcome-type';

interface OutcomeIconProps {
    outcomeType: OutcomeType;
}

export const OutcomeIcon = NamedFC<OutcomeIconProps>('OutcomeIcon', props => outcomeIconMap[props.outcomeType]);
