// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CheckIcon, CheckIconInverted } from 'common/icons/check-icon';
import { CircleIcon } from 'common/icons/circle-icon';
import { CrossIcon, CrossIconInverted } from 'common/icons/cross-icon';
import { InapplicableIcon, InapplicableIconInverted } from 'common/icons/inapplicable-icon';
import * as React from 'react';

import { UrlOutcomeType } from 'reports/components/url-outcome-type';
import { InstanceOutcomeType } from './instance-outcome-type';
import { RequirementOutcomeType } from './requirement-outcome-type';

export type OutcomeStats = { [OT in OutcomeType]: number };
export type OutcomeType = RequirementOutcomeType | InstanceOutcomeType | UrlOutcomeType;

export interface OutcomeTypeSemantic {
    pastTense: string;
}

export const outcomeTypeSemantics: { [OT in OutcomeType]: OutcomeTypeSemantic } = {
    pass: { pastTense: 'Passed' },
    incomplete: { pastTense: 'Incomplete' },
    fail: { pastTense: 'Failed' },
    inapplicable: { pastTense: 'Not applicable' },
    review: { pastTense: 'Needs review' },
    unscannable: { pastTense: 'Not scanned' },
};

export const outcomeIconMap: { [OT in OutcomeType]: JSX.Element } = {
    pass: <CheckIcon />,
    incomplete: <CircleIcon />,
    fail: <CrossIcon />,
    inapplicable: <InapplicableIcon />,
    review: <CircleIcon />,
    unscannable: <InapplicableIcon />,
};

export const outcomeIconMapInverted: { [OT in OutcomeType]: JSX.Element } = {
    pass: <CheckIconInverted />,
    incomplete: <CircleIcon />,
    fail: <CrossIconInverted />,
    inapplicable: <InapplicableIconInverted />,
    review: <CircleIcon />,
    unscannable: <InapplicableIconInverted />,
};
