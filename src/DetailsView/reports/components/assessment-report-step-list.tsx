// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { IInstanceReportModel, IRequirementReportModel } from '../assessment-report-model';
import { AssessmentReportInstanceList } from './assessment-report-instance-list';
import { AssessmentReportStepHeader } from './assessment-report-step-header';

export interface AssessmentReportStepProps {
    status: ManualTestStatus;
    steps: IRequirementReportModel[];
}

export const AssessmentReportStepList = NamedSFC<AssessmentReportStepProps>('AssessmentReportStepList', props => {
    const { status, steps } = props;

    return <div>{renderSteps()}</div>;

    function renderSteps() {
        return steps.map(({ key, header, instances, defaultMessageComponent, showPassingInstances }) => {
            const showInstances = status !== ManualTestStatus.PASS || showPassingInstances;

            return (
                <div className="step-details" key={key}>
                    <AssessmentReportStepHeader
                        header={header}
                        instanceCount={instances.length}
                        status={status}
                        defaultMessageComponent={defaultMessageComponent}
                    />
                    {showInstances && renderStepInstances(instances)}
                </div>
            );
        });
    }

    function renderStepInstances(instances: IInstanceReportModel[]) {
        if (status === ManualTestStatus.UNKNOWN) {
            return;
        }

        return <AssessmentReportInstanceList instances={instances} />;
    }
});
