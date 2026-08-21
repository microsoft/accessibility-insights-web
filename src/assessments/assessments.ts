// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentAssessment } from './adaptable-content/assessment';
import { AssessmentsProviderImpl } from './assessments-provider';
import { AudioVideoOnlyAssessment } from './audio-video-only/assessment';
import { AutomatedChecks } from './automated-checks/assessment';
import { CognitiveAssessment } from './cognitive/assessment';
import { ColorSensoryAssessment } from './color/assessment';
import { ContrastAssessment } from './contrast/assessment';
import { CustomWidgets } from './custom-widgets/assessment';
import { ErrorsAssessment } from './errors/assessment';
import { HeadingsAssessment } from './headings/assessment';
import { ImagesAssessment } from './images/assessment';
import { KeyboardInteraction } from './keyboard-interaction/assessment';
import { LandmarksAssessment } from './landmarks/assessment';
import { LanguageAssessment } from './language/assessment';
import { LinksAssessment } from './links/assessments';
import { LiveMultimediaAssessment } from './live-multimedia/assessment';
import { NativeWidgetsAssessment } from './native-widgets/assessment';
import { PageAssessment } from './page/assessment';
import { PointerMotionAssessment } from './pointer-motion/assessment';
import { PrerecordedMultimediaAssessment } from './prerecorded-multimedia/assessment';
import { RepetitiveContentAssessment } from './repetitive-content/assessment';
import { SemanticsAssessment } from './semantics/assessment';
import { SequenceAssessment } from './sequence/assessment';
import { TimedEventsAssessment } from './timed-events/assessment';
import { AssessmentsProvider } from './types/assessments-provider';
import { VisibleFocusOrderAssessment } from './visible-focus-order/assessment';

export const Assessments: AssessmentsProvider = AssessmentsProviderImpl.Create([
    AutomatedChecks,
    KeyboardInteraction,
    VisibleFocusOrderAssessment,
    LandmarksAssessment,
    HeadingsAssessment,
    RepetitiveContentAssessment,
    LinksAssessment,
    NativeWidgetsAssessment,
    CustomWidgets,
    TimedEventsAssessment,
    ErrorsAssessment,
    PageAssessment,
    ImagesAssessment,
    LanguageAssessment,
    ColorSensoryAssessment,
    AdaptableContentAssessment,
    AudioVideoOnlyAssessment,
    PrerecordedMultimediaAssessment,
    LiveMultimediaAssessment,
    SequenceAssessment,
    SemanticsAssessment,
    PointerMotionAssessment,
    ContrastAssessment,
    CognitiveAssessment,
]);
