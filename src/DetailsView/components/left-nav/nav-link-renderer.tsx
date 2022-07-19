// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { onBaseLeftNavItemRender } from 'DetailsView/components/base-left-nav';
import {
    AssessmentLeftNavLink,
    TestRequirementLeftNavLink,
} from 'DetailsView/components/left-nav/assessment-left-nav';
import commonLeftNavLinkStyles from 'DetailsView/components/left-nav/common-left-nav-link.scss';
import { GettingStartedNavLink } from 'DetailsView/components/left-nav/getting-started-nav-link';
import { LeftNavIndexIcon, LeftNavStatusIcon } from 'DetailsView/components/left-nav/left-nav-icon';
import styles from 'DetailsView/components/left-nav/nav-link-renderer.scss';
import { OverviewLeftNavLink } from 'DetailsView/components/left-nav/overview-left-nav-link';
import { TestViewLeftNavLink } from 'DetailsView/components/left-nav/test-view-left-nav-link';
import * as React from 'react';

export class NavLinkRenderer {
    public renderVisualizationLink: onBaseLeftNavItemRender = link => (
        <TestViewLeftNavLink link={link} renderIcon={this.renderVisualizationIcon} />
    );

    public renderRequirementLink: onBaseLeftNavItemRender = link => (
        <TestViewLeftNavLink link={link} renderIcon={this.renderRequirementIcon} />
    );

    public renderAssessmentTestLink: onBaseLeftNavItemRender = link => (
        <TestViewLeftNavLink link={link} renderIcon={this.renderAssessmentTestIcon} />
    );

    public renderOverviewLink: onBaseLeftNavItemRender = l => <OverviewLeftNavLink link={l} />;

    public renderGettingStartedLink: onBaseLeftNavItemRender = () => <GettingStartedNavLink />;

    private renderVisualizationIcon: onBaseLeftNavItemRender = link => (
        <LeftNavIndexIcon item={link} />
    );

    private renderRequirementIcon = (link: TestRequirementLeftNavLink) => {
        if (link.status === ManualTestStatus.UNKNOWN) {
            return <>{link.displayedIndex}</>;
        }

        return <LeftNavStatusIcon className={styles.requirementStatusIcon} item={link} />;
    };

    private renderAssessmentTestIcon: onBaseLeftNavItemRender = (link: AssessmentLeftNavLink) => {
        if (link.status === ManualTestStatus.UNKNOWN) {
            return <LeftNavIndexIcon item={link} />;
        }

        return <LeftNavStatusIcon className={commonLeftNavLinkStyles.linkIcon} item={link} />;
    };
}
