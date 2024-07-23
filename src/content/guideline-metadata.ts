// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceTag, guidanceTags } from 'common/types/store-data/guidance-links';

export interface GuidelineMetadata {
    number: string;
    axeTag: string;
    name: string;
    linkName: string;
    linkTag: string;
    link: string;
    guidanceTags: GuidanceTag[];
}

// Maps from axe-core rule/result objects' tags property (eg, "wcag1411") to the guidance
// metadata used within our application, including the link tag (eg, WCAG_1_4_11)
//
// Note: it is intentional that not all axe tags map to metadata in our application! In particular:
// * cat.whatever are omitted (they are axe-specific and don't correspond to any official
//   accessibility standard)
// * wcag2a, wcag2aa, wcag21a, wcag21aa are omitted in favor of the more specific links for
//   individual wcag sections
// * experimental is omitted (we only show them at all in needs-review)
// * wcag123 tags for AAA requirements are omitted (to avoid user confusion about whether we support
//   AAA assessments)
const axeTagToGuidelineKeyMap = {
    wcag111: 'WCAG 1.1.1',
    wcag121: 'WCAG 1.2.1',
    wcag122: 'WCAG 1.2.2',
    wcag123: 'WCAG 1.2.3',
    wcag124: 'WCAG 1.2.4',
    wcag125: 'WCAG 1.2.5',
    wcag131: 'WCAG 1.3.1',
    wcag132: 'WCAG 1.3.2',
    wcag133: 'WCAG 1.3.3',
    wcag134: 'WCAG 1.3.4',
    wcag135: 'WCAG 1.3.5',
    wcag141: 'WCAG 1.4.1',
    wcag142: 'WCAG 1.4.2',
    wcag143: 'WCAG 1.4.3',
    wcag144: 'WCAG 1.4.4',
    wcag145: 'WCAG 1.4.5',
    wcag1410: 'WCAG 1.4.10',
    wcag1411: 'WCAG 1.4.11',
    wcag1412: 'WCAG 1.4.12',
    wcag1413: 'WCAG 1.4.13',
    wcag211: 'WCAG 2.1.1',
    wcag212: 'WCAG 2.1.2',
    wcag214: 'WCAG 2.1.4',
    wcag221: 'WCAG 2.2.1',
    wcag222: 'WCAG 2.2.2',
    wcag231: 'WCAG 2.3.1',
    wcag241: 'WCAG 2.4.1',
    wcag242: 'WCAG 2.4.2',
    wcag243: 'WCAG 2.4.3',
    wcag244: 'WCAG 2.4.4',
    wcag245: 'WCAG 2.4.5',
    wcag246: 'WCAG 2.4.6',
    wcag247: 'WCAG 2.4.7',
    wcag2411: 'WCAG 2.4.11',
    wcag251: 'WCAG 2.5.1',
    wcag252: 'WCAG 2.5.2',
    wcag253: 'WCAG 2.5.3',
    wcag254: 'WCAG 2.5.4',
    wcag255: 'WCAG 2.5.5',
    wcag257: 'WCAG 2.5.7',
    wcag258: 'WCAG 2.5.8',
    wcag311: 'WCAG 3.1.1',
    wcag312: 'WCAG 3.1.2',
    wcag321: 'WCAG 3.2.1',
    wcag322: 'WCAG 3.2.2',
    wcag323: 'WCAG 3.2.3',
    wcag324: 'WCAG 3.2.4',
    wcag326: 'WCAG 3.2.6',
    wcag331: 'WCAG 3.3.1',
    wcag332: 'WCAG 3.3.2',
    wcag333: 'WCAG 3.3.3',
    wcag334: 'WCAG 3.3.4',
    wcag337: 'WCAG 3.3.7',
    wcag338: 'WCAG 3.3.8',
    wcag411: 'WCAG 4.1.1',
    wcag412: 'WCAG 4.1.2',
    wcag413: 'WCAG 4.1.3',
};

export const getGuidelineKeyByAxeTag = (axeTag: string): string => {
    return axeTagToGuidelineKeyMap[axeTag];
};

export const guidelineMetadata = {
    'WCAG 1.1.1': {
        number: '1.1.1',
        axeTag: 'wcag111',
        name: 'Non-text Content',
        linkName: 'WCAG 1.1.1',
        linkTag: 'WCAG_1_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        guidanceTags: [],
    },
    'WCAG 1.2.1': {
        number: '1.2.1',
        axeTag: 'wcag121',
        name: 'Audio-only and Video-only (Prerecorded)',
        linkName: 'WCAG 1.2.1',
        linkTag: 'WCAG_1_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded',
        guidanceTags: [],
    },
    'WCAG 1.2.2': {
        number: '1.2.2',
        axeTag: 'wcag122',
        name: 'Captions (Prerecorded)',
        linkName: 'WCAG 1.2.2',
        linkTag: 'WCAG_1_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
        guidanceTags: [],
    },
    'WCAG 1.2.3': {
        number: '1.2.3',
        axeTag: 'wcag123',
        name: 'Audio Description or Media Alternative (Prerecorded)',
        linkName: 'WCAG 1.2.3',
        linkTag: 'WCAG_1_2_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded',
        guidanceTags: [],
    },
    'WCAG 1.2.4': {
        number: '1.2.4',
        axeTag: 'wcag124',
        name: 'Captions (Live)',
        linkName: 'WCAG 1.2.4',
        linkTag: 'WCAG_1_2_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-live.html',
        guidanceTags: [],
    },
    'WCAG 1.2.5': {
        number: '1.2.5',
        axeTag: 'wcag125',
        name: 'Audio Description (Prerecorded)',
        linkName: 'WCAG 1.2.5',
        linkTag: 'WCAG_1_2_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded',
        guidanceTags: [],
    },
    'WCAG 1.3.1': {
        number: '1.3.1',
        axeTag: 'wcag131',
        name: 'Info and Relationships',
        linkName: 'WCAG 1.3.1',
        linkTag: 'WCAG_1_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
        guidanceTags: [],
    },
    'WCAG 1.3.2': {
        number: '1.3.2',
        axeTag: 'wcag132',
        name: 'Meaningful Sequence',
        linkName: 'WCAG 1.3.2',
        linkTag: 'WCAG_1_3_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html',
        guidanceTags: [],
    },
    'WCAG 1.3.3': {
        number: '1.3.3',
        axeTag: 'wcag133',
        name: 'Sensory Characteristics',
        linkName: 'WCAG 1.3.3',
        linkTag: 'WCAG_1_3_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html',
        guidanceTags: [],
    },
    'WCAG 1.3.4': {
        number: '1.3.4',
        axeTag: 'wcag134',
        name: 'Orientation',
        linkName: 'WCAG 1.3.4',
        linkTag: 'WCAG_1_3_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/orientation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 1.3.5': {
        number: '1.3.5',
        axeTag: 'wcag135',
        name: 'Identify Input Purpose',
        linkName: 'WCAG 1.3.5',
        linkTag: 'WCAG_1_3_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 1.4.1': {
        number: '1.4.1',
        axeTag: 'wcag141',
        name: 'Use of Color',
        linkName: 'WCAG 1.4.1',
        linkTag: 'WCAG_1_4_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html',
        guidanceTags: [],
    },
    'WCAG 1.4.2': {
        number: '1.4.2',
        axeTag: 'wcag142',
        name: 'Audio Control',
        linkName: 'WCAG 1.4.2',
        linkTag: 'WCAG_1_4_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html',
        guidanceTags: [],
    },
    'WCAG 1.4.3': {
        number: '1.4.3',
        axeTag: 'wcag143',
        name: 'Contrast (Minimum)',
        linkName: 'WCAG 1.4.3',
        linkTag: 'WCAG_1_4_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
        guidanceTags: [],
    },
    'WCAG 1.4.4': {
        number: '1.4.4',
        axeTag: 'wcag144',
        name: 'Resize text',
        linkName: 'WCAG 1.4.4',
        linkTag: 'WCAG_1_4_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
        guidanceTags: [],
    },
    'WCAG 1.4.5': {
        number: '1.4.5',
        axeTag: 'wcag145',
        name: 'Images of Text',
        linkName: 'WCAG 1.4.5',
        linkTag: 'WCAG_1_4_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html',
        guidanceTags: [],
    },
    // wcag146: intentionally omitted, AAA
    'WCAG 1.4.10': {
        number: '1.4.10',
        axeTag: 'wcag1410',
        name: 'Reflow',
        linkTag: 'WCAG_1_4_10',
        linkName: 'WCAG 1.4.10',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/reflow.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 1.4.11': {
        number: '1.4.11',
        axeTag: 'wcag1411',
        name: 'Non-text Contrast',
        linkTag: 'WCAG_1_4_11',
        linkName: 'WCAG 1.4.11',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 1.4.12': {
        number: '1.4.12',
        axeTag: 'wcag1412',
        name: 'Text Spacing',
        linkTag: 'WCAG_1_4_12',
        linkName: 'WCAG 1.4.12',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 1.4.13': {
        number: '1.4.13',
        axeTag: 'wcag1413',
        name: 'Content on Hover or Focus',
        linkTag: 'WCAG_1_4_13',
        linkName: 'WCAG 1.4.13',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.1.1': {
        number: '2.1.1',
        axeTag: 'wcag211',
        name: 'Keyboard',
        linkName: 'WCAG 2.1.1',
        linkTag: 'WCAG_2_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        guidanceTags: [],
    },
    'WCAG 2.1.2': {
        number: '2.1.2',
        axeTag: 'wcag212',
        name: 'No Keyboard Trap',
        linkName: 'WCAG 2.1.2',
        linkTag: 'WCAG_2_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html',
        guidanceTags: [],
    },
    'WCAG 2.1.4': {
        number: '2.1.4',
        axeTag: 'wcag214',
        name: 'Character Key Shortcuts',
        linkName: 'WCAG 2.1.4',
        linkTag: 'WCAG_2_1_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.2.1': {
        number: '2.2.1',
        axeTag: 'wcag221',
        name: 'Timing Adjustable',
        linkName: 'WCAG 2.2.1',
        linkTag: 'WCAG_2_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html',
        guidanceTags: [],
    },
    'WCAG 2.2.2': {
        number: '2.2.2',
        axeTag: 'wcag222',
        name: 'Pause, Stop, Hide',
        linkName: 'WCAG 2.2.2',
        linkTag: 'WCAG_2_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide',
        guidanceTags: [],
    },
    // wcag223: intentionally omitted, AAA
    // wcag224: intentionally omitted, AAA
    'WCAG 2.3.1': {
        number: '2.3.1',
        axeTag: 'wcag231',
        name: 'Three Flashes or Below Threshold',
        linkName: 'WCAG 2.3.1',
        linkTag: 'WCAG_2_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html',
        guidanceTags: [],
    },
    'WCAG 2.4.1': {
        number: '2.4.1',
        axeTag: 'wcag241',
        name: 'Bypass Blocks',
        linkName: 'WCAG 2.4.1',
        linkTag: 'WCAG_2_4_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks',
        guidanceTags: [],
    },
    'WCAG 2.4.2': {
        number: '2.4.2',
        axeTag: 'wcag242',
        name: 'Page Titled',
        linkName: 'WCAG 2.4.2',
        linkTag: 'WCAG_2_4_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
        guidanceTags: [],
    },
    'WCAG 2.4.3': {
        number: '2.4.3',
        axeTag: 'wcag243',
        name: 'Focus Order',
        linkName: 'WCAG 2.4.3',
        linkTag: 'WCAG_2_4_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html',
        guidanceTags: [],
    },
    'WCAG 2.4.4': {
        number: '2.4.4',
        axeTag: 'wcag244',
        name: 'Link Purpose (In Context)',
        linkName: 'WCAG 2.4.4',
        linkTag: 'WCAG_2_4_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
        guidanceTags: [],
    },
    'WCAG 2.4.5': {
        number: '2.4.5',
        axeTag: 'wcag245',
        name: 'Multiple Ways',
        linkName: 'WCAG 2.4.5',
        linkTag: 'WCAG_2_4_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html',
        guidanceTags: [],
    },
    'WCAG 2.4.6': {
        number: '2.4.6',
        axeTag: 'wcag246',
        name: 'Headings and Labels',
        linkName: 'WCAG 2.4.6',
        linkTag: 'WCAG_2_4_6',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels',
        guidanceTags: [],
    },
    'WCAG 2.4.7': {
        number: '2.4.7',
        axeTag: 'wcag247',
        name: 'Focus Visible',
        linkName: 'WCAG 2.4.7',
        linkTag: 'WCAG_2_4_7',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
        guidanceTags: [],
    },
    // wcag248: intentionally omitted, AAA
    // wcag249: intentionally omitted, AAA
    // wcag2410: intentionally omitted, AAA
    'WCAG 2.4.11': {
        number: '2.4.11',
        axeTag: 'wcag2411',
        name: 'Focus Appearance',
        linkName: 'WCAG 2.4.11',
        linkTag: 'WCAG_2_4_11',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-minimum.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 2.5.1': {
        number: '2.5.1',
        axeTag: 'wcag251',
        name: 'Pointer Gestures',
        linkName: 'WCAG 2.5.1',
        linkTag: 'WCAG_2_5_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.5.2': {
        number: '2.5.2',
        axeTag: 'wcag252',
        name: 'Pointer Cancellation',
        linkName: 'WCAG 2.5.2',
        linkTag: 'WCAG_2_5_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.5.3': {
        number: '2.5.3',
        axeTag: 'wcag253',
        name: 'Label in Name',
        linkName: 'WCAG 2.5.3',
        linkTag: 'WCAG_2_5_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/label-in-name',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.5.4': {
        number: '2.5.4',
        axeTag: 'wcag254',
        name: 'Motion Actuation',
        linkName: 'WCAG 2.5.4',
        linkTag: 'WCAG_2_5_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    'WCAG 2.5.5': {
        number: '2.5.5',
        axeTag: 'wcag255',
        name: 'Target Size',
        linkName: 'WCAG 2.5.5',
        linkTag: 'WCAG_2_5_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html',
        guidanceTags: [],
    },
    // wcag256: intentionally omitted, AAA
    'WCAG 2.5.7': {
        number: '2.5.7',
        axeTag: 'wcag257',
        name: 'Dragging Movements',
        linkName: 'WCAG 2.5.7',
        linkTag: 'WCAG_2_5_7',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 2.5.8': {
        number: '2.5.8',
        axeTag: 'wcag258',
        name: 'Target Size',
        linkName: 'WCAG 2.5.8',
        linkTag: 'WCAG_2_5_8',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 3.1.1': {
        number: '3.1.1',
        axeTag: 'wcag311',
        name: 'Language of Page',
        linkName: 'WCAG 3.1.1',
        linkTag: 'WCAG_3_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
        guidanceTags: [],
    },
    'WCAG 3.1.2': {
        number: '3.1.2',
        axeTag: 'wcag312',
        name: 'Language of Parts',
        linkName: 'WCAG 3.1.2',
        linkTag: 'WCAG_3_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html',
        guidanceTags: [],
    },
    'WCAG 3.2.1': {
        number: '3.2.1',
        axeTag: 'wcag321',
        name: 'On Focus',
        linkName: 'WCAG 3.2.1',
        linkTag: 'WCAG_3_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html',
        guidanceTags: [],
    },
    'WCAG 3.2.2': {
        number: '3.2.2',
        axeTag: 'wcag322',
        name: 'On Input',
        linkName: 'WCAG 3.2.2',
        linkTag: 'WCAG_3_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/on-input.html',
        guidanceTags: [],
    },
    'WCAG 3.2.3': {
        number: '3.2.3',
        axeTag: 'wcag323',
        name: 'Consistent Navigation',
        linkName: 'WCAG 3.2.3',
        linkTag: 'WCAG_3_2_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation',
        guidanceTags: [],
    },
    'WCAG 3.2.4': {
        number: '3.2.4',
        axeTag: 'wcag324',
        name: 'Consistent Identification',
        linkName: 'WCAG 3.2.4',
        linkTag: 'WCAG_3_2_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification',
        guidanceTags: [],
    },
    // wcag325: intentionally omitted, AAA
    'WCAG 3.2.6': {
        number: '3.2.6',
        axeTag: 'wcag326',
        name: 'Consistent Help',
        linkName: 'WCAG 3.2.6',
        linkTag: 'WCAG_3_2_6',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 3.3.1': {
        number: '3.3.1',
        axeTag: 'wcag331',
        name: 'Error Identification',
        linkName: 'WCAG 3.3.1',
        linkTag: 'WCAG_3_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html',
        guidanceTags: [],
    },
    'WCAG 3.3.2': {
        number: '3.3.2',
        axeTag: 'wcag332',
        name: 'Labels or Instructions',
        linkName: 'WCAG 3.3.2',
        linkTag: 'WCAG_3_3_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
        guidanceTags: [],
    },
    'WCAG 3.3.3': {
        number: '3.3.3',
        axeTag: 'wcag333',
        name: 'Error Suggestion',
        linkName: 'WCAG 3.3.3',
        linkTag: 'WCAG_3_3_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html',
        guidanceTags: [],
    },
    'WCAG 3.3.4': {
        number: '3.3.4',
        axeTag: 'wcag334',
        name: 'Error Prevention (Legal, Financial, Data)',
        linkName: 'WCAG 3.3.4',
        linkTag: 'WCAG_3_3_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html',
        guidanceTags: [],
    },
    // wcag335: intentionally omitted, AAA
    'WCAG 3.3.7': {
        number: '3.3.7',
        axeTag: 'wcag337',
        name: 'Redundant Entry',
        linkName: 'WCAG 3.3.7',
        linkTag: 'WCAG_3_3_7',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 3.3.8': {
        number: '3.3.8',
        axeTag: 'wcag338',
        name: 'Accessible Authentication',
        linkName: 'WCAG 3.3.8',
        linkTag: 'WCAG_3_3_8',
        link: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html',
        guidanceTags: [guidanceTags.WCAG_2_2],
    },
    'WCAG 4.1.1': {
        number: '4.1.1',
        axeTag: 'wcag411',
        name: 'Parsing',
        linkName: 'WCAG 4.1.1',
        linkTag: 'WCAG_4_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html',
        guidanceTags: [guidanceTags.WCAG_2_2_DEPRECATION],
    },
    'WCAG 4.1.2': {
        number: '4.1.2',
        axeTag: 'wcag412',
        name: 'Name, Role, Value',
        linkName: 'WCAG 4.1.2',
        linkTag: 'WCAG_4_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
        guidanceTags: [],
    },
    'WCAG 4.1.3': {
        number: '4.1.3',
        axeTag: 'wcag413',
        name: 'Status Messages',
        linkName: 'WCAG 4.1.3',
        linkTag: 'WCAG_4_1_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
};
