// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { InapplicableIcon, InapplicableIconInverted } from '../../../common/icons/inapplicable-icon';
import { CheckIcon, CheckIconInverted } from './../../../common/icons/check-icon';
import { CircleIcon } from './../../../common/icons/circle-icon';
import { CrossIcon, CrossIconInverted } from './../../../common/icons/cross-icon';
import { RequirementOutcomeType } from './requirement-outcome-type';

export type OutcomeUnits = 'percentage' | 'requirements';

export type InstanceOutcomeType = 'pass' | 'fail' | 'inapplicable';
export const allOutcomeTypes: OutcomeType[] = ['fail', 'pass', 'inapplicable', 'incomplete'];

export type OutcomeStats = { [OT in OutcomeType]: number };
export type OutcomeType = RequirementOutcomeType | InstanceOutcomeType;

export interface OutcomeTypeSemantic {
    pastTense: string;
}

export const outcomeTypeSemantics: { [OT in OutcomeType]: OutcomeTypeSemantic } = {
    pass: { pastTense: 'Passed' },
    incomplete: { pastTense: 'Incomplete' },
    fail: { pastTense: 'Failed' },
    inapplicable: { pastTense: 'Not applicable' },
};

export const outcomeIconMap: { [OT in OutcomeType]: JSX.Element } = {
    pass: <CheckIcon />,
    incomplete: <CircleIcon />,
    fail: <CrossIcon />,
    inapplicable: <InapplicableIcon />,
};

export const outcomeIconMapInverted: { [OT in OutcomeType]: JSX.Element } = {
    pass: <CheckIconInverted />,
    incomplete: <CircleIcon />,
    fail: <CrossIconInverted />,
    inapplicable: <InapplicableIconInverted />,
};
