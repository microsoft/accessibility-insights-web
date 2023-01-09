// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessment } from 'assessments/types/iassessment';
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import { NamedFC } from 'common/react/named-fc';
import styles from 'DetailsView/components/getting-started-view.scss';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
} from 'DetailsView/components/next-requirement-button';
import * as React from 'react';
import { ContentLinkDeps } from 'views/content/content-link';

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
                    <HeadingWithContentLink
                        deps={deps}
                        headerClass={styles.gettingStartedHeader}
                        headingTitleClassName={styles.gettingStartedHeaderTitle}
                        headingTitle={title}
                        guidance={guidance}
                    />
                    <h2 className={styles.gettingStartedTitle}>Getting started</h2>
                    {gettingStarted}
                </div>
                <NextRequirementButton
                    nextRequirement={firstRequirement}
                    nextRequirementVisualizationType={visualizationType}
                    className={styles.nextRequirementButton}
                    deps={deps}
                />
            </div>
        );
    },
);
