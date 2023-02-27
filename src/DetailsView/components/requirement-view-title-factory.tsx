// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton, ContentPanelButtonDeps } from 'views/content/content-panel-button';
import styles from './requirement-view-title.scss';

export type RequirementViewTitleDeps = GuidanceTagsDeps & ContentPanelButtonDeps;

export interface RequirementViewTitleFactoryProps {
    deps: RequirementViewTitleDeps;
    name: string;
    guidanceLinks: HyperlinkDefinition[];
    infoAndExamples: ContentPageComponent | undefined;
    assessmentKey: string;
}

export type RequirementViewTitleFactory = (props: RequirementViewTitleFactoryProps) => JSX.Element;

export function getRequirementViewTitleForAssessment(
    props: RequirementViewTitleFactoryProps,
): JSX.Element {
    return (
        <h1 className={styles.requirementViewTitle}>
            {props.name}
            <GuidanceTags deps={props.deps} links={props.guidanceLinks} />
            <ContentPanelButton
                deps={props.deps}
                reference={props.infoAndExamples}
                iconName="info"
                contentTitle={props.name}
            />
        </h1>
    );
}

export function getRequirementViewTitleForQuickAssess(
    props: RequirementViewTitleFactoryProps,
): JSX.Element {
    if (props.assessmentKey === AutomatedChecks.key) {
        return getRequirementViewTitleForAssessment(props);
    }
    return <h1 className={styles.requirementViewTitle}>{props.name}</h1>;
}
