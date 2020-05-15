// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { Tab } from '../../common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    gettingStartedSubview,
    PersistedTabInfo,
} from '../../common/types/store-data/assessment-result-data';
import { GettingStartedView } from './getting-started-view';
import { TargetChangeDialog, TargetChangeDialogDeps } from './target-change-dialog';

export type ReflowAssessmentViewDeps = TargetChangeDialogDeps;

export type ReflowAssessmentViewProps = {
    deps: ReflowAssessmentViewDeps;
    assessmentNavState: AssessmentNavState;
    assessmentData: AssessmentData;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    assessmentTestResult: AssessmentTestResult;
};

export const ReflowAssessmentView = NamedFC<ReflowAssessmentViewProps>(
    'ReflowAssessmentView',
    props => {
        const targetChangeDialog: JSX.Element = (
            <TargetChangeDialog
                deps={props.deps}
                prevTab={props.prevTarget}
                newTab={props.currentTarget}
            />
        );

        if (props.assessmentNavState.selectedTestSubview === gettingStartedSubview) {
            return (
                <div>
                    {targetChangeDialog}
                    <GettingStartedView
                        gettingStartedContent={props.assessmentTestResult.definition.gettingStarted}
                    />
                </div>
            );
        }
        return null;
    },
);
