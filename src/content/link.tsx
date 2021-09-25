// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from 'common/guidance-links';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { guidanceMetadataByAxeTag } from './guidance-metadata-by-axe-tag';

function linkTo(text: string, href: string): HyperlinkDefinition {
    return { text, href };
}

function guidanceLinkTo(axeTag: string): GuidanceLink {
    return {
        text: guidanceMetadataByAxeTag[axeTag].name,
        href: guidanceMetadataByAxeTag[axeTag].link,
        tags: guidanceMetadataByAxeTag[axeTag].guidanceTags,
    };
}

export const link = {
    WCAG_1_1_1: guidanceLinkTo('wcag111'),
    WCAG_1_2_1: guidanceLinkTo('wcag121'),
    WCAG_1_2_2: guidanceLinkTo('wcag122'),
    WCAG_1_2_3: guidanceLinkTo('wcag123'),
    WCAG_1_2_4: guidanceLinkTo('wcag124'),
    WCAG_1_2_5: guidanceLinkTo('wcag125'),
    WCAG_1_3_1: guidanceLinkTo('wcag131'),
    WCAG_1_3_2: guidanceLinkTo('wcag132'),
    WCAG_1_3_3: guidanceLinkTo('wcag133'),
    WCAG_1_3_4: guidanceLinkTo('wcag134'),
    WCAG_1_3_5: guidanceLinkTo('wcag135'),
    WCAG_1_4_1: guidanceLinkTo('wcag141'),
    WCAG_1_4_2: guidanceLinkTo('wcag142'),
    WCAG_1_4_3: guidanceLinkTo('wcag143'),
    WCAG_1_4_4: guidanceLinkTo('wcag144'),
    WCAG_1_4_5: guidanceLinkTo('wcag145'),
    WCAG_1_4_10: guidanceLinkTo('wcag1410'),
    WCAG_1_4_11: guidanceLinkTo('wcag1411'),
    WCAG_1_4_12: guidanceLinkTo('wcag1412'),
    WCAG_1_4_13: guidanceLinkTo('wcag1413'),
    WCAG_2_1_1: guidanceLinkTo('wcag211'),
    WCAG_2_1_2: guidanceLinkTo('wcag212'),
    WCAG_2_1_4: guidanceLinkTo('wcag214'),
    WCAG_2_2_1: guidanceLinkTo('wcag221'),
    WCAG_2_2_2: guidanceLinkTo('wcag222'),
    WCAG_2_3_1: guidanceLinkTo('wcag231'),
    WCAG_2_4_1: guidanceLinkTo('wcag241'),
    WCAG_2_4_2: guidanceLinkTo('wcag242'),
    WCAG_2_4_3: guidanceLinkTo('wcag243'),
    WCAG_2_4_4: guidanceLinkTo('wcag244'),
    WCAG_2_4_5: guidanceLinkTo('wcag245'),
    WCAG_2_4_6: guidanceLinkTo('wcag246'),
    WCAG_2_4_7: guidanceLinkTo('wcag247'),
    WCAG_2_5_1: guidanceLinkTo('wcag251'),
    WCAG_2_5_2: guidanceLinkTo('wcag252'),
    WCAG_2_5_3: guidanceLinkTo('wcag253'),
    WCAG_2_5_4: guidanceLinkTo('wcag254'),
    WCAG_2_5_5: guidanceLinkTo('wcag255'),
    WCAG_3_1_1: guidanceLinkTo('wcag311'),
    WCAG_3_1_2: guidanceLinkTo('wcag312'),
    WCAG_3_2_1: guidanceLinkTo('wcag321'),
    WCAG_3_2_2: guidanceLinkTo('wcag322'),
    WCAG_3_2_3: guidanceLinkTo('wcag323'),
    WCAG_3_2_4: guidanceLinkTo('wcag324'),
    WCAG_3_3_1: guidanceLinkTo('wcag331'),
    WCAG_3_3_2: guidanceLinkTo('wcag332'),
    WCAG_3_3_3: guidanceLinkTo('wcag333'),
    WCAG_3_3_4: guidanceLinkTo('wcag334'),
    WCAG_4_1_1: guidanceLinkTo('wcag411'),
    WCAG_4_1_2: guidanceLinkTo('wcag412'),
    WCAG_4_1_3: guidanceLinkTo('wcag413'),
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
