// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
} from 'DetailsView/components/requirement-view-title';
import * as React from 'react';

export type RequirementViewDeps = RequirementViewTitleDeps;
export interface RequirementViewProps {
    deps: RequirementViewDeps;
    requirement: Requirement;
}

export const RequirementView = NamedFC<RequirementViewProps>('RequirementView', props => {
    return (
        <div>
            <RequirementViewTitle
                deps={props.deps}
                name={props.requirement.name}
                guidanceLinks={props.requirement.guidanceLinks}
                infoAndExamples={props.requirement.infoAndExamples}
            ></RequirementViewTitle>
            {props.requirement.description}
        </div>
    );
});
