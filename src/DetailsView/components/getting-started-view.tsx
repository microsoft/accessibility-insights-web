// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as styles from 'DetailsView/components/getting-started-view.scss';
import { DefaultButton, Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentPageComponent } from 'views/content/content-page';

export type GettingStartedViewDeps = ContentLinkDeps & {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface GettingStartedViewProps {
    deps: GettingStartedViewDeps;
    gettingStartedContent: JSX.Element;
    title: string;
    guidance: ContentPageComponent;
    nextRequirement: Requirement;
    currentTest: VisualizationType;
}

export const GettingStartedView = NamedFC<GettingStartedViewProps>('GettingStartedView', props => {
    const selectNextRequirement = (event: React.MouseEvent<HTMLElement>) => {
        props.deps.detailsViewActionMessageCreator.selectRequirement(
            event,
            props.nextRequirement.key,
            props.currentTest,
        );
    };

    return (
        <div className={styles.gettingStartedView}>
            <div>
                <h1 className={styles.gettingStartedHeader}>
                    <span className={styles.gettingStartedHeaderTitle}>{props.title}</span>
                    <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
                </h1>
                <h2 className={styles.gettingStartedTitle}>Getting Started</h2>
                {props.gettingStartedContent}
            </div>
            <DefaultButton
                text={props.nextRequirement.name}
                className={styles.nextRequirementButton}
                onClick={selectNextRequirement}
            >
                <span>
                    <Icon iconName="ChevronRight" />
                </span>
            </DefaultButton>
        </div>
    );
});
