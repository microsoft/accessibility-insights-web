// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { guidelineMetadata } from './guideline-metadata';

function linkTo(text: string, href: string): HyperlinkDefinition {
    return { text, href };
}

function guidanceLinkTo(criterion: string): GuidanceLink {
    return {
        text: guidelineMetadata[criterion].linkName,
        href: guidelineMetadata[criterion].link,
        tags: guidelineMetadata[criterion].guidanceTags,
    };
}

export const link = {
    WCAG_1_1_1: guidanceLinkTo('WCAG 1.1.1'),
    WCAG_1_2_1: guidanceLinkTo('WCAG 1.2.1'),
    WCAG_1_2_2: guidanceLinkTo('WCAG 1.2.2'),
    WCAG_1_2_3: guidanceLinkTo('WCAG 1.2.3'),
    WCAG_1_2_4: guidanceLinkTo('WCAG 1.2.4'),
    WCAG_1_2_5: guidanceLinkTo('WCAG 1.2.5'),
    WCAG_1_3_1: guidanceLinkTo('WCAG 1.3.1'),
    WCAG_1_3_2: guidanceLinkTo('WCAG 1.3.2'),
    WCAG_1_3_3: guidanceLinkTo('WCAG 1.3.3'),
    WCAG_1_3_4: guidanceLinkTo('WCAG 1.3.4'),
    WCAG_1_3_5: guidanceLinkTo('WCAG 1.3.5'),
    WCAG_1_4_1: guidanceLinkTo('WCAG 1.4.1'),
    WCAG_1_4_2: guidanceLinkTo('WCAG 1.4.2'),
    WCAG_1_4_3: guidanceLinkTo('WCAG 1.4.3'),
    WCAG_1_4_4: guidanceLinkTo('WCAG 1.4.4'),
    WCAG_1_4_5: guidanceLinkTo('WCAG 1.4.5'),
    WCAG_1_4_10: guidanceLinkTo('WCAG 1.4.10'),
    WCAG_1_4_11: guidanceLinkTo('WCAG 1.4.11'),
    WCAG_1_4_12: guidanceLinkTo('WCAG 1.4.12'),
    WCAG_1_4_13: guidanceLinkTo('WCAG 1.4.13'),
    WCAG_2_1_1: guidanceLinkTo('WCAG 2.1.1'),
    WCAG_2_1_2: guidanceLinkTo('WCAG 2.1.2'),
    WCAG_2_1_4: guidanceLinkTo('WCAG 2.1.4'),
    WCAG_2_2_1: guidanceLinkTo('WCAG 2.2.1'),
    WCAG_2_2_2: guidanceLinkTo('WCAG 2.2.2'),
    WCAG_2_3_1: guidanceLinkTo('WCAG 2.3.1'),
    WCAG_2_4_1: guidanceLinkTo('WCAG 2.4.1'),
    WCAG_2_4_2: guidanceLinkTo('WCAG 2.4.2'),
    WCAG_2_4_3: guidanceLinkTo('WCAG 2.4.3'),
    WCAG_2_4_4: guidanceLinkTo('WCAG 2.4.4'),
    WCAG_2_4_5: guidanceLinkTo('WCAG 2.4.5'),
    WCAG_2_4_6: guidanceLinkTo('WCAG 2.4.6'),
    WCAG_2_4_7: guidanceLinkTo('WCAG 2.4.7'),
    WCAG_2_5_1: guidanceLinkTo('WCAG 2.5.1'),
    WCAG_2_5_2: guidanceLinkTo('WCAG 2.5.2'),
    WCAG_2_5_3: guidanceLinkTo('WCAG 2.5.3'),
    WCAG_2_5_4: guidanceLinkTo('WCAG 2.5.4'),
    WCAG_2_5_5: guidanceLinkTo('WCAG 2.5.5'),
    WCAG_3_1_1: guidanceLinkTo('WCAG 3.1.1'),
    WCAG_3_1_2: guidanceLinkTo('WCAG 3.1.2'),
    WCAG_3_2_1: guidanceLinkTo('WCAG 3.2.1'),
    WCAG_3_2_2: guidanceLinkTo('WCAG 3.2.2'),
    WCAG_3_2_3: guidanceLinkTo('WCAG 3.2.3'),
    WCAG_3_2_4: guidanceLinkTo('WCAG 3.2.4'),
    WCAG_3_3_1: guidanceLinkTo('WCAG 3.3.1'),
    WCAG_3_3_2: guidanceLinkTo('WCAG 3.3.2'),
    WCAG_3_3_3: guidanceLinkTo('WCAG 3.3.3'),
    WCAG_3_3_4: guidanceLinkTo('WCAG 3.3.4'),
    WCAG_4_1_1: guidanceLinkTo('WCAG 4.1.1'),
    WCAG_4_1_2: guidanceLinkTo('WCAG 4.1.2'),
    WCAG_4_1_3: guidanceLinkTo('WCAG 4.1.3'),
    BingoBakery: linkTo('Bingo Bakery Video', 'https://go.microsoft.com/fwlink/?linkid=2080372'),
    VoiceControlVideo: linkTo('Voice Control Video', 'https://www.youtube.com/watch?v=bAFzL-dOzu0'),
    TablesVideo: linkTo('Tables Video', 'https://www.youtube.com/watch?v=I2meEap25UA'),
    HeadingsVideo: linkTo('Headings Video', 'https://www.youtube.com/watch?v=S0pJcYyxBWo'),
    FormLabelsVideo: linkTo('Form Labels Video', 'https://www.youtube.com/watch?v=Mki-ZknCrB4'),
    IdentifyHeadings: linkTo('Techniques for WCAG 2.0: Using h1-h6 to identify headings', 'https://www.w3.org/TR/WCAG20-TECHS/H42.html'),
    LandmarkRegions: linkTo(
        'WAI-ARIA Authoring Practices 1.1: Landmark Regions',
        'https://www.w3.org/TR/wai-aria-practices-1.1/#aria_landmark',
    ),
    accessileNameComputation: linkTo('ARIA 1.1 Important Terms Section', 'https://www.w3.org/TR/wai-aria/#terms'),
    Keyboard: linkTo('WebAIM: Keyboard Accessibility', 'https://aka.ms/webaim/keyboard-accessibility'),
    InteroperabilityWithAT: linkTo(
        'Section 508 - 502.2.2',
        'https://www.access-board.gov/guidelines-and-standards/communications-and-it/about-the-ict-refresh/final-rule/text-of-the-standards-and-guidelines#502-interoperability-assistive-technology',
    ),
    Presbyopia: linkTo('presbyopia', 'https://en.wikipedia.org/wiki/Presbyopia'),
    WAIARIAAuthoringPractices: linkTo(
        'WAI-ARIA Authoring Practices 1.1: Design Patterns and Widgets',
        'https://www.w3.org/TR/wai-aria-practices-1.1/',
    ),
    WCAG21UnderstandingUseOfColor: linkTo(
        'Understanding Success Criterion 1.4.1: Use of Color',
        'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html',
    ),
    WCAG21UnderstandingInfoAndRelationships: linkTo('WCAG 1.3.1', 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships'),
    WCAG21UnderstandingLabelInName: linkTo('WCAG 2.5.3', 'https://www.w3.org/WAI/WCAG21/Understanding/label-in-name'),
    WCAG21UnderstandingLabelsOrInstructions: linkTo('WCAG 3.3.2', 'https://www.w3.org/WAI/WCAG21/Understanding/label-in-name'),
    WCAG21UnderstandingAudioOnlyViewOnlyPrerecorded: linkTo(
        'Understanding Success Criterion 1.2.1: Audio-only and Video-only (Prerecorded)',
        'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html',
    ),
    WCAG21TechniquesG83: linkTo(
        'Providing text descriptions to identify required fields that were not completed',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G83',
    ),
    WCAG21TechniquesG89: linkTo('Providing expected data format and example', 'https://www.w3.org/WAI/WCAG21/Techniques/general/G89'),
    WCAG21TechniquesG90: linkTo('Providing keyboard-triggered event handlers', 'https://www.w3.org/WAI/WCAG21/Techniques/general/G90'),
    WCAG21TechniquesG131: linkTo('Providing descriptive labels', 'https://www.w3.org/WAI/WCAG21/Techniques/general/G131'),
    WCAG21TechniquesG138: linkTo(
        'Using semantic markup whenever color cues are used',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G138',
    ),
    WCAG21TechniquesG158: linkTo(
        'Providing an alternative for time-based media for audio-only content',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G158',
    ),
    WCAG21TechniquesG159: linkTo(
        'Providing an alternative for time-based media for video-only content',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G159',
    ),
    WCAG21TechniquesG166: linkTo(
        'Providing audio that describes the important video content and describing it as such',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G166',
    ),
    WCAG21TechniquesG202: linkTo(
        'Ensuring keyboard control for all functionality',
        'https://www.w3.org/WAI/WCAG21/Techniques/general/G202',
    ),
};
