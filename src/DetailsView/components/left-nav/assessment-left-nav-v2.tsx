import * as React from 'react';

import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { NamedSFC } from '../../../common/react/named-sfc';
import { IManualTestStatus, ManualTestStatus } from '../../../common/types/manual-test-status';
import { BaseLeftNav, BaseLeftNavLink } from '../base-left-nav';
import { LeftNavIndexIcon, LeftNavStatusIcon } from './left-nav-icon';
import { AssessmentLinkBuilderDeps, LeftNavLinkBuilder, OverviewLinkBuilderDeps } from './left-nav-link-builder';
import { NavLinkHandler } from './nav-link-handler';

export type AssessmentLeftNavV2Deps = {
    leftNavLinkBuilder: LeftNavLinkBuilder,
    navLinkHandler: NavLinkHandler,
} & OverviewLinkBuilderDeps & AssessmentLinkBuilderDeps;

export type AssessmentLeftNavV2Props = {
    deps: AssessmentLeftNavV2Deps;
    selectedKey: string,
    assessmentsProvider: IAssessmentsProvider,
    assessmentsData: IDictionaryStringTo<IManualTestStatus>;
};

export type AssessmentLeftNavLink  = {
    status: ManualTestStatus;
} & BaseLeftNavLink;

export const AssessmentLeftNavV2 = NamedSFC<AssessmentLeftNavV2Props>('AssessmentLeftNavV2', props => {
    const {
        deps,
        selectedKey,
        assessmentsProvider,
        assessmentsData,
    } = props;

    const {
        navLinkHandler,
        leftNavLinkBuilder,
    } = deps;

    const renderAssessmentIcon = (link: AssessmentLeftNavLink) => {
        if (link.status === ManualTestStatus.UNKNOWN) {
            return (
                <LeftNavIndexIcon item={link} />
            );
        }

        return (
            <LeftNavStatusIcon item={link} />
        );
    };

    let links = [];
    links.push(leftNavLinkBuilder.withOverviewLink(deps, navLinkHandler.onOverviewClick, assessmentsProvider, assessmentsData, 0));
    links = links.concat(leftNavLinkBuilder.withAssessmentLinks(
        deps,
        navLinkHandler.onAssessmentTestClickV2,
        assessmentsProvider,
        assessmentsData,
        1,
    ));

    return (
        <BaseLeftNav
            renderIcon={renderAssessmentIcon}
            selectedKey={selectedKey}
            links={links}
        />
    );
});