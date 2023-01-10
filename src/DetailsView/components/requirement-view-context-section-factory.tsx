// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import {
    RequirementContextSection,
    RequirementContextSectionProps,
} from 'DetailsView/components/requirement-context-section';
import * as React from 'react';

export type RequirementContextSectionFactoryProps = {
    requirementKey: string;
    className: string;
} & RequirementContextSectionProps;

export type RequirementContextSectionFactory = (
    props: RequirementContextSectionFactoryProps,
) => JSX.Element | null;

export function getRequirementContextSectionForAssessment(
    props: RequirementContextSectionFactoryProps,
): JSX.Element | null {
    return null;
}

export function getRequirementContextSectionForQuickAssess(
    props: RequirementContextSectionFactoryProps,
): JSX.Element | null {
    if (props.requirementKey === AutomatedChecks.key) {
        return null;
    }

    return (
        <div className={props.className}>
            <RequirementContextSection {...props} />
        </div>
    );
}
