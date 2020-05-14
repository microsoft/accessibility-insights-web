// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from 'common/types/manual-test-status';
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';
import { some } from 'lodash';

export function autoPassIfNoLandmarks(instanceData: InstanceIdToInstanceDataMap): ManualTestStatus {
    const someInstanceHasLandmarkRole = some(
        Object.values(instanceData),
        instance => instance.propertyBag != null && instance.propertyBag['role'] != null,
    );

    return someInstanceHasLandmarkRole ? ManualTestStatus.UNKNOWN : ManualTestStatus.PASS;
}
