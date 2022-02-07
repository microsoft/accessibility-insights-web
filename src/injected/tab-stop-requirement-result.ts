// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export type TabStopRequirementResult = {
    requirementId: TabStopRequirementId;
    description: string;
    selector?: string[];
    html?: string;
};

export type AutomatedTabStopRequirementResult = TabStopRequirementResult & {
    selector: string[];
    html: string;
};
