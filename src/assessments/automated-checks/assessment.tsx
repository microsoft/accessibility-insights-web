// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createAutomatedChecksInitialAssessmentTestData } from 'background/create-initial-assessment-test-data';
import { FeatureFlags } from 'common/feature-flags';
import { VisualizationType } from 'common/types/visualization-type';
import { title } from 'content/strings/application';
import { test as content } from 'content/test';
import { excludePassingInstancesFromAssessmentReport } from 'DetailsView/extensions/exclude-passing-instances-from-assessment-report';
import * as React from 'react';
import { getDefaultRules } from 'scanner/exposed-apis';

import { AssessmentBuilder } from '../assessment-builder';
import { AssistedAssessment } from '../types/iassessment';
import { buildTestStepsFromRules } from './build-test-steps-from-rules';

const { guidance } = content.automatedChecks;
const gettingStarted: JSX.Element = (
    <p>
        {title} automated accessibility checks can detect some of the most common accessibility
        issues, depending on the complexity of the site or the application.
    </p>
);

const config: AssistedAssessment = {
    key: 'automated-checks',
    title: 'Automated checks',
    subtitle: (
        <>
            Automated checks can detect some common accessibility problems such as missing or
            invalid properties but most accessibility problems can only be discovered through manual
            testing.
        </>
    ),
    visualizationType: VisualizationType.AutomatedChecks,
    initialDataCreator: createAutomatedChecksInitialAssessmentTestData,
    gettingStarted,
    guidance,
    requirements: buildTestStepsFromRules(getDefaultRules()),
    extensions: [excludePassingInstancesFromAssessmentReport],
    isNonCollapsible: true,
    getTestViewContainer: (provider, props) =>
        props.featureFlagStoreData[FeatureFlags.automatedChecks]
            ? provider.createAssessmentAutomatedChecksTestViewContainer(props)
            : provider.createAssessmentTestViewContainer(props),
};

export const AutomatedChecks = AssessmentBuilder.Assisted(config);
