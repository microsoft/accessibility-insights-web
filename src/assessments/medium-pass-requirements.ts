// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { ImagesTestStep } from 'assessments/images/test-steps/test-steps';
import { KeyboardInteractionTestStep } from 'assessments/keyboard-interaction/test-steps/test-steps';
import { LinksTestStep } from 'assessments/links/test-steps/test-steps';
import { RepetitiveContentTestStep } from 'assessments/repetitive-content/test-steps/test-steps';
import { visibleFfocusOrderTestStep } from 'assessments/visible-focus-order/test-steps/test-steps';

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
