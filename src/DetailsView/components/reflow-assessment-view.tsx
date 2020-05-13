// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { Tab } from '../../common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from '../../common/types/store-data/assessment-result-data';
import { GettingStartedView } from './getting-started-view';
import { TargetChangeDialog, TargetChangeDialogDeps } from './target-change-dialog';

export type ReflowAssessmentViewDeps = {
    assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
} & AssessmentViewUpdateHandlerDeps &
    TargetChangeDialogDeps;

export type ReflowAssessmentViewProps = {
    deps: ReflowAssessmentViewDeps;
    assessmentNavState: AssessmentNavState;
    assessmentData: AssessmentData;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    assessmentTestResult: AssessmentTestResult;
};

export class ReflowAssessmentView extends React.Component<ReflowAssessmentViewProps> {
    public render(): JSX.Element {
        const { assessmentTestResult } = this.props;
        if (this.props.assessmentNavState.selectedTestSubview === 'getting-started') {
            return (
                <div>
                    {this.renderTargetChangeDialog()}
                    <GettingStartedView
                        gettingStartedContent={assessmentTestResult.definition.gettingStarted}
                    />
                </div>
            );
        }
        return null;
    }

    // public componentDidMount(): void {
    //     this.props.deps.assessmentViewUpdateHandler.onMount(this.props);
    // }

    // public componentDidUpdate(prevProps: ReflowAssessmentViewProps): void {
    //     this.props.deps.assessmentViewUpdateHandler.update(prevProps, this.props);
    // }

    // public componentWillUnmount(): void {
    //     this.props.deps.assessmentViewUpdateHandler.onUnmount(this.props);
    // }

    private renderTargetChangeDialog(): JSX.Element {
        return (
            <TargetChangeDialog
                deps={this.props.deps}
                prevTab={this.props.prevTarget}
                newTab={this.props.currentTarget}
            />
        );
    }
}
