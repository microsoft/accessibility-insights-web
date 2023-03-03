// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton, ContentPanelButtonDeps } from 'views/content/content-panel-button';
import { MarkupDeps } from 'views/content/markup';
import { HelpLinks, HelpLinksDeps } from './help-links';
import styles from './requirement-context-section.scss';

export type RequirementContextSectionDeps = ContentPanelButtonDeps & MarkupDeps & HelpLinksDeps;

export interface RequirementContextSectionProps {
    deps: RequirementContextSectionDeps;
    infoAndExamples: ContentPageComponent | undefined;
    whyItMatters: ContentPageComponent | undefined;
    helpfulResourceLinks?: HyperlinkDefinition[];
}

export const RequirementContextSection = NamedFC(
    'RequirementContextSection',
    (props: RequirementContextSectionProps) => {
        return (
            <section className={styles.requirementContextContainer}>
                <h3 className={styles.contextHeading}>Why it matters</h3>
                {props.whyItMatters ? <props.whyItMatters deps={props.deps} /> : null}
                <h3 className={styles.contextHeading}>Helpful resources</h3>
                <div className={styles.contextLinks}>
                    <ContentPanelButton
                        deps={props.deps}
                        reference={props.infoAndExamples}
                        contentTitle="Info and examples"
                    >
                        Info and examples
                    </ContentPanelButton>
                    {props.helpfulResourceLinks && (
                        <HelpLinks linkInformation={props.helpfulResourceLinks} deps={props.deps} />
                    )}
                </div>
            </section>
        );
    },
);
