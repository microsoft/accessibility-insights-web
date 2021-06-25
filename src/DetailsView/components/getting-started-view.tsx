// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessment } from 'assessments/types/iassessment';
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/getting-started-view.scss';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
} from 'DetailsView/components/next-requirement-button';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';

export type GettingStartedViewDeps = ContentLinkDeps & NextRequirementButtonDeps;
export interface GettingStartedViewProps {
    deps: GettingStartedViewDeps;
    assessment: Assessment;
}

export const GettingStartedView = NamedFC<GettingStartedViewProps>(
    'GettingStartedView',
    ({ deps, assessment }) => {
        const { gettingStarted, title, guidance, visualizationType, requirements } = assessment;

        const firstRequirement = requirements[0] ?? null;

        return (
            <div className={styles.gettingStartedView}>
                <div>
                    <h1 className={styles.gettingStartedHeader}>
                        <span className={styles.gettingStartedHeaderTitle}>{title}</span>
                        <ContentLink deps={deps} reference={guidance} iconName="info" />
                    </h1>
                    <h2 className={styles.gettingStartedTitle}>Getting started</h2>
                    {gettingStarted}
                </div>
                <NextRequirementButton
                    nextRequirement={firstRequirement}
                    currentTest={visualizationType}
                    className={styles.nextRequirementButton}
                    deps={deps}
                />
            </div>
        );
    },
);
