// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import {
    AssessmentNavState,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { AdhocIssuesTestViewProps } from 'DetailsView/components/adhoc-issues-test-view';
import styles from 'DetailsView/components/adhoc-issues-test-view.scss';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { BannerWarnings, BannerWarningsDeps } from 'DetailsView/components/banner-warnings';
import {
    DetailsListIssuesView,
    DetailsListIssuesViewDeps,
} from 'DetailsView/components/details-list-issues-view';
import {
    TargetChangeDialog,
    TargetChangeDialogDeps,
} from 'DetailsView/components/target-change-dialog';
import { isEqual } from 'lodash';
import * as React from 'react';

export type AssessmentIssuesTestViewDeps = {
    assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
    getProvider: () => AssessmentsProvider;
} & BannerWarningsDeps &
    TargetChangeDialogDeps &
    AssessmentViewUpdateHandlerDeps &
    DetailsListIssuesViewDeps;

export type AssessmentIssuesTestViewProps = {
    deps: AssessmentIssuesTestViewDeps;
    assessmentStoreData: AssessmentStoreData;
    includeStepsText?: boolean;
} & Omit<AdhocIssuesTestViewProps, 'deps'>;

export class AssessmentIssuesTestView extends React.Component<AssessmentIssuesTestViewProps> {
    public componentDidMount(): void {
        this.props.deps.assessmentViewUpdateHandler.onMount(this.getUpdateHandlerProps(this.props));
    }

    public componentDidUpdate(prevProps: AssessmentIssuesTestViewProps): void {
        const prevUpdateHandlerProps = this.getUpdateHandlerProps(prevProps);
        const newUpdateHandlerProps = this.getUpdateHandlerProps(this.props);

        if (isEqual(prevUpdateHandlerProps, newUpdateHandlerProps)) {
            return;
        }

        this.props.deps.assessmentViewUpdateHandler.update(
            prevUpdateHandlerProps,
            newUpdateHandlerProps,
        );
    }

    public componentWillUnmount(): void {
        this.props.deps.assessmentViewUpdateHandler.onUnmount(
            this.getUpdateHandlerProps(this.props),
        );
    }

    private getUpdateHandlerProps(
        props: AssessmentIssuesTestViewProps,
    ): AssessmentViewUpdateHandlerProps {
        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const propNavState = props.assessmentStoreData.assessmentNavState;
        const selectedRequirementIsEnabled = props.configuration.getTestStatus(
            scanData,
            propNavState.selectedTestSubview,
        );
        const assessmentData = props.configuration.getAssessmentData!(props.assessmentStoreData);
        const assessment = props.deps.getProvider().forType(propNavState.selectedTestType);

        const navState = {
            selectedTestType: propNavState.selectedTestType,
            /*
                A couple notes:
                1. Because we run this with the previous props and the underlying assessment
                provider can be switched, the assessment returned can be null (i.e. looking for a
                quick assess assessment object from prevProps using the full assessment provider or
                vice versa).

                2. Since no test subview/requirement is specifically selected in automated checks,
                we default to first requirement.
            */
            selectedTestSubview: assessment?.requirements[0].key,
        } as AssessmentNavState;

        return {
            deps: props.deps,
            selectedRequirementIsEnabled: selectedRequirementIsEnabled,
            assessmentNavState: navState,
            assessmentData: assessmentData,
            prevTarget: props.assessmentStoreData.persistedTabInfo,
            currentTarget: this.getCurrentTarget(),
        };
    }

    public render = () => {
        const view = this.createTestView(this.props);

        return <div className={styles.issuesTestView}>{view}</div>;
    };

    private getCurrentTarget = () => {
        return {
            id: this.props.tabStoreData.id,
            url: this.props.tabStoreData.url,
            title: this.props.tabStoreData.title,
        };
    };

    private createTestView(props: AssessmentIssuesTestViewProps): JSX.Element {
        const { deps } = props;
        const prevTarget = props.assessmentStoreData.persistedTabInfo;

        return (
            <>
                <BannerWarnings
                    deps={props.deps}
                    warnings={props.scanIncompleteWarnings}
                    warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                    test={props.selectedTest}
                    visualizationStoreData={props.visualizationStoreData}
                />
                <TargetChangeDialog
                    deps={deps}
                    prevTab={prevTarget}
                    newTab={this.getCurrentTarget()}
                />
                <DetailsListIssuesView {...props} />
            </>
        );
    }
}
