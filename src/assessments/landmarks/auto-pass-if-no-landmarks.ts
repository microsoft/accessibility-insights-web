// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from 'common/types/manual-test-status';
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';
import { some } from 'lodash';
import { LandmarkTestStep } from './test-steps/test-steps';

export function autoPassIfNoLandmarks(instanceData: InstanceIdToInstanceDataMap): ManualTestStatus {
    const someInstanceHasLandmarkRoleResult = some(
        Object.values(instanceData),
        instance => instance.testStepResults[LandmarkTestStep.landmarkRoles] != null,
    );

    return someInstanceHasLandmarkRoleResult ? ManualTestStatus.UNKNOWN : ManualTestStatus.PASS;
}
