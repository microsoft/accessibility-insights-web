// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';

export interface IInstanceTableColumn {
    key: string;
    name: string;
    onRender: (item: IAssessmentInstanceRowData) => JSX.Element;
}
