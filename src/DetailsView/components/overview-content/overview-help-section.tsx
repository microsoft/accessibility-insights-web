// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import * as React from 'react';
import { HelpLinks, HelpLinksDeps } from '../help-links';
import styles from './overview-help-section.scss';
import { OverviewHelpSectionAboutFactory } from 'DetailsView/components/overview-content/overview-help-section-about';

export type OverviewHelpSectionDeps = HelpLinksDeps;

export interface OverviewHelpSectionProps {
    deps: OverviewHelpSectionDeps;
    linkDataSource: HyperlinkDefinition[];
    getAboutComponent: OverviewHelpSectionAboutFactory;
}

export const OverviewHelpSection = NamedFC(
    'OverviewHelpSection',
    (props: OverviewHelpSectionProps) => {
        return (
            <section className={styles.overviewHelpContainer}>
                <h3 className={styles.helpHeading}>Help</h3>
                <HelpLinks linkInformation={props.linkDataSource} deps={props.deps} />
                {props.getAboutComponent()}
            </section>
        );
    },
);
