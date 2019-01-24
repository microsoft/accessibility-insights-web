// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CheckIcon } from '../../../common/icons/check-icon';
import { CircleIcon } from '../../../common/icons/circle-icon';
import { CrossIcon } from '../../../common/icons/cross-icon';
import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeType } from './outcome-type';

interface OutcomeIconProps {
    outcomeType: OutcomeType;
}

const iconMap = {
    pass: <CheckIcon />,
    incomplete: <CircleIcon />,
    fail: <CrossIcon />,
};

export const OutcomeIcon = NamedSFC<OutcomeIconProps>('OutcomeIcon', props => iconMap[props.outcomeType]);
