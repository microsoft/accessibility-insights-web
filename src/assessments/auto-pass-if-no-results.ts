// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { isEmpty } from 'lodash';

export function autoPassIfNoResults(instanceData: InstanceIdToInstanceDataMap): ManualTestStatus {
    return isEmpty(instanceData) ? ManualTestStatus.PASS : ManualTestStatus.UNKNOWN;
}
