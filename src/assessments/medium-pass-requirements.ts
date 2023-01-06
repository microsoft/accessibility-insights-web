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

export const MediumPassRequirementKeys: string[] = [
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

export const MediumPassRequirementMap: DictionaryStringTo<VisualizationType> = {
    [KeyboardInteractionTestStep.keyboardNavigation]:
        VisualizationType.KeyboardInteractionMediumPass,
    [LinksTestStep.linkPurpose]: VisualizationType.LinksMediumPass,
    [ImagesTestStep.imageFunction]: VisualizationType.ImagesMediumPass,
    [visibleFfocusOrderTestStep.focusOrder]: VisualizationType.VisibleFocusOrderMediumPass,
    [ContrastTestStep.uiComponents]: VisualizationType.ContrastMediumPass,
    [HeadingsTestStep.missingHeadings]: VisualizationType.HeadingsMediumPass,
    [HeadingsTestStep.headingLevel]: VisualizationType.HeadingsMediumPass,
    [RepetitiveContentTestStep.bypassBlocks]: VisualizationType.RepetitiveContentMediumPass,
    [NativeWidgetsTestStep.instructions]: VisualizationType.NativeWidgetsMediumPass,
    [AdaptableContentTestStep.reflow]: VisualizationType.AdaptableContentMediumPass,
};
