// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export interface RequirementViewProps {
    requirement: Requirement;
}

export const RequirementView = NamedFC<RequirementViewProps>('RequirementView', props => {
    return <div>{props.requirement.description}</div>;
});
