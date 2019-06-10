// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from '../../../common/react/named-sfc';
import { outcomeIconMapInverted, OutcomeType } from './outcome-type';

interface OutcomeIconProps {
    outcomeType: OutcomeType;
}

export const OutcomeIcon = NamedSFC<OutcomeIconProps>('OutcomeIcon', props => outcomeIconMapInverted[props.outcomeType]);
