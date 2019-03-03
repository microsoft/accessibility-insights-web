// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { RequirementComparer } from '../../common/assessment/requirement-comparer';
import { VisualizationType } from '../../common/types/visualization-type';
import { title } from '../../content/strings/application';
import { excludePassingInstancesFromAssessmentReport } from '../../DetailsView/extensions/exclude-passing-instances-from-assessment-report';
import { selectFirstRequirementAfterAutomatedChecks } from '../../DetailsView/extensions/select-first-requirement-after-automated-checks';
import { waitForAllRequirementsToComplete } from '../../DetailsView/extensions/wait-for-all-requirements-to-complete';
import { AssessmentBuilder } from '../assessment-builder';
import { AssistedAssessment } from '../types/iassessment';
import { buildTestStepsFromRules } from './build-test-steps-from-rules';
import { getDefaultRules } from '../../scanner/exposed-apis';
import { test as content } from '../../content/test';

const { guidance } = content.automatedChecks;
const gettingStarted: JSX.Element = (
    <p>
        {title} automated accessibility checks can detect some of the most common accessibility issues, depending on the complexity of the
        site or the app​​​lication.
    </p>
);

const config: AssistedAssessment = {
    key: 'automated-checks',
    title: 'Automated checks',
    storeDataKey: 'automatedChecks',
    type: VisualizationType.AutomatedChecks,
    gettingStarted,
    guidance,
    steps: buildTestStepsFromRules(getDefaultRules()),
    requirementOrder: RequirementComparer.byOutcomeAndName,
    extensions: [waitForAllRequirementsToComplete, selectFirstRequirementAfterAutomatedChecks, excludePassingInstancesFromAssessmentReport],
};

export const AutomatedChecks = AssessmentBuilder.Assisted(config);
