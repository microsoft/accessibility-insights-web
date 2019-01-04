// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { map } from 'lodash';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { PivotConfiguration } from '../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { IManualTestStatus, ManualTestStatus } from '../../../common/types/manual-test-status';
import { VisualizationType } from '../../../common/types/visualization-type';
import {
    OutcomeStats,
    outcomeStatsFromManualTestStatus,
    outcomeTypeFromTestStatus,
} from '../../reports/components/outcome-type';
import { GetAssessmentSummaryModelFromProviderAndStatusData } from '../../reports/get-assessment-summary-model';
import { NavLinkForLeftNav } from '../details-view-left-nav';
import { StatusIcon } from '../status-icon';
import { getTestLinks } from './links-provider';
import { OverviewLeftNavLink } from './overview-left-nav-link';
import { TestViewLeftNavLink } from './test-view-left-nav-link';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { NavLinkHandler } from './nav-link-handler';

export interface AssessmentLeftNavDeps {
    pivotConfiguration: PivotConfiguration;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    getAssessmentSummaryModelFromProviderAndStatusData: GetAssessmentSummaryModelFromProviderAndStatusData;
    navLinkHandler: NavLinkHandler;
}

export interface AssessmentLeftNavProps {
    deps: AssessmentLeftNavDeps;
    selectedPivot: DetailsViewPivotType;
    selectedDetailsView: VisualizationType;
    renderNav: (selectedKey: string, links: INavLink[], renderIcon: (link: INavLink) => JSX.Element) => JSX.Element;
    assessmentsData: IDictionaryStringTo<IManualTestStatus>;
    assessmentProvider: IAssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
}

export const AssessmentLeftNav = NamedSFC<AssessmentLeftNavProps>('AssessmentLeftNav', props => {
    const { selectedPivot, selectedDetailsView, renderNav, assessmentsData, assessmentProvider, rightPanelConfiguration } = props;
    const {
        pivotConfiguration,
        visualizationConfigurationFactory,
        getAssessmentSummaryModelFromProviderAndStatusData,
        navLinkHandler,
    } = props.deps;

    const getStatusForTest = (assessmentKey: string): ManualTestStatus => {
        const stepStatus = assessmentsData[assessmentKey];
        const stats = outcomeStatsFromManualTestStatus(stepStatus);

        if (stats.incomplete > 0) {
            return ManualTestStatus.UNKNOWN;
        }
        else if (stats.fail > 0) {
            return ManualTestStatus.FAIL;
        }
        else {
            return ManualTestStatus.PASS;
        }
    };

    const getOverviewStatsForAssessment = (): OutcomeStats => {
        const model = getAssessmentSummaryModelFromProviderAndStatusData(assessmentProvider, assessmentsData);
        return model.byPercentage;
    };

    const insertOverviewLink = (testLinks: NavLinkForLeftNav[]): NavLinkForLeftNav[] => {
        const overviewStats = getOverviewStatsForAssessment();
        const percentComplete = 100 - overviewStats.incomplete;
        const overviewLink: NavLinkForLeftNav = {
            name: 'Overview',
            key: 'Overview',
            forceAnchor: true,
            url: '',
            index: 0,
            title: `Overview ${percentComplete}% Completed`,
            percentComplete,
            onRenderNavLink: (l, ri) => <OverviewLeftNavLink link={l} renderIcon={ri} />,
            iconProps: {
                className: 'hidden',
            },
            onClickNavLink: navLinkHandler.onOverviewClick,
        };

        return [overviewLink, ...testLinks];
    };

    const getAssessmentLinks = (): NavLinkForLeftNav[] => {
        const assessments = assessmentProvider.all();

        const testLinks = map(assessments, (assessment, index) => {
            const displayIndex = index + 1;
            const status = getStatusForTest(assessment.key);
            const narratorTestStatus = outcomeTypeFromTestStatus(status);

            const testLink: NavLinkForLeftNav = {
                name: assessment.title,
                key: VisualizationType[assessment.type],
                forceAnchor: true,
                url: '',
                index: displayIndex,
                status,
                title: `${displayIndex} ${assessment.title} ${narratorTestStatus}`,
                onRenderNavLink: (l, ri) => <TestViewLeftNavLink link={l} renderIcon={ri} />,
                iconProps: {
                    className: 'hidden',
                },
                onClickNavLink: navLinkHandler.onAssessmentTestClick,
            };
            return testLink;
        });

        return insertOverviewLink(testLinks);
    };

    const renderIndexIcon = (link: INavLink) => {
        return (
            <div className={'index-circle'}>
                {link.index}
            </div>
        );
    };

    const renderStatusIcon = (link: INavLink) => {
        return (
            <div>
                <StatusIcon
                    status={link.status}
                    className={'dark-gray'}
                />
            </div>
        );
    };

    const renderAssessmentIcon = (link: INavLink) => {
        if (link.status === ManualTestStatus.UNKNOWN) {
            return renderIndexIcon(link);
        }

        return renderStatusIcon(link);
    };

    let links: INavLink[] = [];
    let renderIcon: (link: INavLink) => JSX.Element;

    if (selectedPivot === DetailsViewPivotType.fastPass) {
        links = getTestLinks(DetailsViewPivotType.fastPass, pivotConfiguration, visualizationConfigurationFactory, navLinkHandler.onTestClick);
        renderIcon = renderIndexIcon;
    } else if (selectedPivot === DetailsViewPivotType.assessment) {
        links = getAssessmentLinks();
        renderIcon = renderAssessmentIcon;
    }

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({ type: selectedDetailsView });
    return renderNav(selectedKey, links, renderIcon);
});
