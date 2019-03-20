// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';

export interface InstanceTableColumn {
    key: string;
    name: string;
    onRender: (item: AssessmentInstanceRowData) => JSX.Element;
}
