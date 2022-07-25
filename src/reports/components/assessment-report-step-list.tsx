// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';

import { InstanceReportModel, RequirementReportModel } from '../assessment-report-model';
import {
    AssessmentReportStepHeader,
    AssessmentReportStepHeaderDeps,
} from './assessment-report-step-header';
import { ReportInstanceList } from './report-instance-list';

export type AssessmentReportStepListDeps = AssessmentReportStepHeaderDeps;

export interface AssessmentReportStepListProps {
    deps: AssessmentReportStepListDeps;
    status: ManualTestStatus;
    steps: RequirementReportModel[];
}

export const AssessmentReportStepList = NamedFC<AssessmentReportStepListProps>(
    'AssessmentReportStepList',
    props => {
        const { deps, status, steps } = props;

        return <div>{renderSteps()}</div>;

        function renderSteps(): JSX.Element[] {
            return steps.map(
                ({ key, header, instances, defaultMessageComponent, showPassingInstances }) => {
                    const showInstances = status !== ManualTestStatus.PASS || showPassingInstances;

                    return (
                        <div className="step-details" key={key}>
                            <AssessmentReportStepHeader
                                deps={deps}
                                header={header}
                                instanceCount={instances.length}
                                status={status}
                                defaultMessageComponent={defaultMessageComponent}
                            />
                            {showInstances && renderStepInstances(instances)}
                        </div>
                    );
                },
            );
        }

        function renderStepInstances(instances: InstanceReportModel[]): JSX.Element {
            if (status === ManualTestStatus.UNKNOWN) {
                return;
            }

            return <ReportInstanceList instances={instances} />;
        }
    },
);
