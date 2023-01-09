// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton, ContentPanelButtonDeps } from 'views/content/content-panel-button';
import styles from './requirement-view-title.scss';

export type RequirementViewTitleDeps = GuidanceTagsDeps & ContentPanelButtonDeps;

export interface RequirementViewTitleProps {
    deps: RequirementViewTitleDeps;
    name: string;
    guidanceLinks: HyperlinkDefinition[];
    infoAndExamples: ContentPageComponent;
    shouldShowInfoButton: boolean;
}

export const RequirementViewTitle = NamedFC<RequirementViewTitleProps>(
    'RequirementViewTitle',
    props => {
        return (
            <h1 className={styles.requirementViewTitle}>
                {props.name}
                {props.shouldShowInfoButton && (
                    <>
                        <GuidanceTags deps={props.deps} links={props.guidanceLinks} />
                        <ContentPanelButton
                            deps={props.deps}
                            reference={props.infoAndExamples}
                            iconName="info"
                            contentTitle={props.name}
                        />
                    </>
                )}
            </h1>
        );
    },
);
