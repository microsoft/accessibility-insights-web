// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { INavLink, Nav } from 'office-ui-fabric-react/lib/Nav';
import { PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';

import { assessmentsProviderWithFeaturesEnabled } from '../../assessments/assessments-feature-flag-filter';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { FeatureFlags } from '../../common/feature-flags';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { IManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { AllTestLeftNav, AllTestLeftNavDeps } from './left-nav/all-test-left-nav';
import { AssessmentLeftNav, AssessmentLeftNavDeps } from './left-nav/assessment-left-nav';

export type DetailsViewLeftNavDeps = AssessmentLeftNavDeps & AllTestLeftNavDeps;

export type LeftNavLinkOnClick = (event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav, selectedPivot: DetailsViewPivotType) => void;

export interface DetailsViewLeftNavProps {
    deps: DetailsViewLeftNavDeps;
    selectedDetailsView: VisualizationType;
    selectedPivot: DetailsViewPivotType;
    actionCreator: DetailsViewActionMessageCreator;
    featureFlagStoreData: IDictionaryStringTo<boolean>;
    assessmentsProvider: IAssessmentsProvider;
    assessmentsData: IDictionaryStringTo<IManualTestStatus>;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
}

export interface NavLinkForLeftNav extends INavLink {
    percentComplete?: number;
    onRenderNavLink: (link: NavLinkForLeftNav, renderIcon: (link: NavLinkForLeftNav) => JSX.Element) => JSX.Element;
    onClickNavLink: LeftNavLinkOnClick;
}

export interface LeftNavLinkProps {
    link: NavLinkForLeftNav;
    renderIcon: (link: NavLinkForLeftNav) => JSX.Element;
}

export class DetailsViewLeftNav extends React.Component<DetailsViewLeftNavProps> {
    public static pivotItemsClassName = 'details-view-test-nav-area';

    public render(): JSX.Element {
        const {
            deps,
            featureFlagStoreData,
            selectedDetailsView,
            selectedPivot,
            assessmentsProvider,
            assessmentsData,
        } = this.props;

        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            assessmentsProvider,
            featureFlagStoreData,
        );

        return (
            <FlaggedComponent
                featureFlagStoreData={featureFlagStoreData}
                featureFlag={FeatureFlags.newAssessmentExperience}
                enableJSXElement={(
                    <AssessmentLeftNav
                        deps={deps}
                        renderNav={this.renderNav}
                        selectedDetailsView={selectedDetailsView}
                        selectedPivot={selectedPivot}
                        assessmentsData={assessmentsData}
                        assessmentProvider={filteredProvider}
                        rightPanelConfiguration={this.props.rightPanelConfiguration}
                    />
                )}
                disableJSXElement={(
                    <AllTestLeftNav
                        deps={deps}
                        renderNav={this.renderNav}
                        selectedDetailsView={selectedDetailsView}
                        selectedPivot={selectedPivot}
                        onPivotItemClick={this.onPivotItemClick}
                    />
                )}
            />
        );
    }

    @autobind
    protected renderNav(
        selectedKey: string,
        links: NavLinkForLeftNav[],
        renderIcon: (link: NavLinkForLeftNav) => JSX.Element,
    ): JSX.Element {
        return (
            <Nav
                className={DetailsViewLeftNav.pivotItemsClassName}
                selectedKey={selectedKey}
                groups={[{
                    links,
                }]}
                onRenderLink={(link: NavLinkForLeftNav) => this.renderNavLink(link, renderIcon)}
                onLinkClick={this.onNavLinkClick}
            />
        );
    }

    @autobind
    protected renderNavLink(link: NavLinkForLeftNav, renderIcon: (link: INavLink) => JSX.Element): JSX.Element {
        return link.onRenderNavLink(link, renderIcon);
    }

    @autobind
    protected onPivotItemClick(item: PivotItem, event?: React.MouseEvent<HTMLElement>): void {
        this.props.actionCreator.sendPivotItemClicked(item.props.itemKey, event);
    }

    @autobind
    protected onNavLinkClick(event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav): void {
        if (item) {
            item.onClickNavLink(event, item, this.props.selectedPivot);
        }
    }
}
