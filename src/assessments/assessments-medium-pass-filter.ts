// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { ImagesTestStep } from 'assessments/images/test-steps/test-steps';
import { KeyboardInteractionTestStep } from 'assessments/keyboard-interaction/test-steps/test-steps';
import { LinksTestStep } from 'assessments/links/test-steps/test-steps';
import { RepetitiveContentTestStep } from 'assessments/repetitive-content/test-steps/test-steps';
import { visibleFfocusOrderTestStep } from 'assessments/visible-focus-order/test-steps/test-steps';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';

export const MediumPassRequirementKeys: string[] = [
    KeyboardInteractionTestStep.keyboardNavigation,
    LinksTestStep.linkPurpose,
    ImagesTestStep.imageFunction,
    visibleFfocusOrderTestStep.visibleFocus,
    AdaptableContentTestStep.contrast,
    HeadingsTestStep.missingHeadings,
    HeadingsTestStep.headingLevel,
    RepetitiveContentTestStep.bypassBlocks,
    AdaptableContentTestStep.reflow,
];

export function assessmentsProviderForRequirements(
    assessmentProvider: AssessmentsProvider,
    featureFlags: FeatureFlagStoreData,
    requirementKeys: string[],
): AssessmentsProvider {
    const enabledFeaturesProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentProvider,
        featureFlags,
    );

    const assessments = enabledFeaturesProvider
        .all()
        .map(assessment => {
            return {
                ...assessment,
                requirements: assessment.requirements.filter(requirement =>
                    requirementKeys.includes(requirement.key),
                ),
            };
        })
        .filter(assessment => assessment.requirements.length > 0);
    assessments.unshift(AutomatedChecks);

    return AssessmentsProviderImpl.Create(assessments);
}
