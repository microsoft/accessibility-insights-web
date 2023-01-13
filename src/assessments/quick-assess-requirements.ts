// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { ContrastTestStep } from 'assessments/contrast/test-steps/test-steps';
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { ImagesTestStep } from 'assessments/images/test-steps/test-steps';
import { KeyboardInteractionTestStep } from 'assessments/keyboard-interaction/test-steps/test-steps';
import { LinksTestStep } from 'assessments/links/test-steps/test-steps';
import { NativeWidgetsTestStep } from 'assessments/native-widgets/test-steps/test-steps';
import { RepetitiveContentTestStep } from 'assessments/repetitive-content/test-steps/test-steps';
import { visibleFfocusOrderTestStep } from 'assessments/visible-focus-order/test-steps/test-steps';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

export const QuickAssessRequirementKeys: string[] = [
    KeyboardInteractionTestStep.keyboardNavigation,
    LinksTestStep.linkPurpose,
    ImagesTestStep.imageFunction,
    visibleFfocusOrderTestStep.focusOrder,
    ContrastTestStep.uiComponents,
    HeadingsTestStep.missingHeadings,
    HeadingsTestStep.headingLevel,
    RepetitiveContentTestStep.bypassBlocks,
    NativeWidgetsTestStep.instructions,
    AdaptableContentTestStep.reflow,
];

export const QuickAssessRequirementMap: DictionaryStringTo<VisualizationType> = {
    [KeyboardInteractionTestStep.keyboardNavigation]:
        VisualizationType.KeyboardInteractionQuickAssess,
    [LinksTestStep.linkPurpose]: VisualizationType.LinksQuickAssess,
    [ImagesTestStep.imageFunction]: VisualizationType.ImagesQuickAssess,
    [visibleFfocusOrderTestStep.focusOrder]: VisualizationType.VisibleFocusOrderQuickAssess,
    [ContrastTestStep.uiComponents]: VisualizationType.ContrastQuickAssess,
    [HeadingsTestStep.missingHeadings]: VisualizationType.HeadingsQuickAssess,
    [HeadingsTestStep.headingLevel]: VisualizationType.HeadingsQuickAssess,
    [RepetitiveContentTestStep.bypassBlocks]: VisualizationType.RepetitiveContentQuickAssess,
    [NativeWidgetsTestStep.instructions]: VisualizationType.NativeWidgetsQuickAssess,
    [AdaptableContentTestStep.reflow]: VisualizationType.AdaptableContentQuickAssess,
};
