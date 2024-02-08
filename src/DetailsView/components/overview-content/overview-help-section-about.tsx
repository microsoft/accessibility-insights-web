// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './overview-help-section.scss';

export type OverviewHelpSectionAboutFactory = () => JSX.Element | null;

export const OverviewHelpSectionAboutForQuickAssess = NamedFC('OverviewHelpSectionAbout', () => {
    return (
        <>
            <h3 className={styles.helpHeading}>About</h3>
            <p>
                Quick Assess is a shortened version of Assessment. In this experience, you will
                navigate through a set of 10 assisted and manual tests that should take less than 30
                minutes to cover limited aspects of the WCAG 2.1 AA and WCAG 2.2 AA success
                criteria.
            </p>
        </>
    );
});

export const getOverviewHelpSectionAboutForQuickAssess: OverviewHelpSectionAboutFactory = () => {
    return <OverviewHelpSectionAboutForQuickAssess />;
};
