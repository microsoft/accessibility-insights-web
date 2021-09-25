// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { guidanceTags } from 'common/guidance-links';

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
export const guidanceMetadataByAxeTag = {
    wcag111: {
        name: 'WCAG 1.1.1',
        linkTag: 'WCAG_1_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        guidanceTags: [],
    },
    wcag121: {
        name: 'WCAG 1.2.1',
        linkTag: 'WCAG_1_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded',
        guidanceTags: [],
    },
    wcag122: {
        name: 'WCAG 1.2.2',
        linkTag: 'WCAG_1_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
        guidanceTags: [],
    },
    wcag123: {
        name: 'WCAG 1.2.3',
        linkTag: 'WCAG_1_2_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded',
        guidanceTags: [],
    },
    wcag124: {
        name: 'WCAG 1.2.4',
        linkTag: 'WCAG_1_2_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-live.html',
        guidanceTags: [],
    },
    wcag125: {
        name: 'WCAG 1.2.5',
        linkTag: 'WCAG_1_2_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded',
        guidanceTags: [],
    },
    wcag131: {
        name: 'WCAG 1.3.1',
        linkTag: 'WCAG_1_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
        guidanceTags: [],
    },
    wcag132: {
        name: 'WCAG 1.3.2',
        linkTag: 'WCAG_1_3_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html',
        guidanceTags: [],
    },
    wcag133: {
        name: 'WCAG 1.3.3',
        linkTag: 'WCAG_1_3_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html',
        guidanceTags: [],
    },
    wcag134: {
        name: 'WCAG 1.3.4',
        linkTag: 'WCAG_1_3_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/orientation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag135: {
        name: 'WCAG 1.3.5',
        linkTag: 'WCAG_1_3_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag141: {
        name: 'WCAG 1.4.1',
        linkTag: 'WCAG_1_4_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html',
        guidanceTags: [],
    },
    wcag142: {
        name: 'WCAG 1.4.2',
        linkTag: 'WCAG_1_4_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html',
        guidanceTags: [],
    },
    wcag143: {
        name: 'WCAG 1.4.3',
        linkTag: 'WCAG_1_4_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
        guidanceTags: [],
    },
    wcag144: {
        name: 'WCAG 1.4.4',
        linkTag: 'WCAG_1_4_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
        guidanceTags: [],
    },
    wcag145: {
        name: 'WCAG 1.4.5',
        linkTag: 'WCAG_1_4_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html',
        guidanceTags: [],
    },
    wcag1410: {
        linkTag: 'WCAG_1_4_10',
        name: 'WCAG 1.4.10',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/reflow.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag1411: {
        linkTag: 'WCAG_1_4_11',
        name: 'WCAG 1.4.11',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag1412: {
        linkTag: 'WCAG_1_4_12',
        name: 'WCAG 1.4.12',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag1413: {
        linkTag: 'WCAG_1_4_13',
        name: 'WCAG 1.4.13',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag211: {
        name: 'WCAG 2.1.1',
        linkTag: 'WCAG_2_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        guidanceTags: [],
    },
    wcag212: {
        name: 'WCAG 2.1.2',
        linkTag: 'WCAG_2_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html',
        guidanceTags: [],
    },
    wcag214: {
        name: 'WCAG 2.1.4',
        linkTag: 'WCAG_2_1_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag221: {
        name: 'WCAG 2.2.1',
        linkTag: 'WCAG_2_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html',
        guidanceTags: [],
    },
    wcag222: {
        name: 'WCAG 2.2.2',
        linkTag: 'WCAG_2_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide',
        guidanceTags: [],
    },
    // wcag223: intentionally omitted, AAA
    // wcag224: intentionally omitted, AAA
    wcag231: {
        name: 'WCAG 2.3.1',
        linkTag: 'WCAG_2_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html',
        guidanceTags: [],
    },
    wcag241: {
        name: 'WCAG 2.4.1',
        linkTag: 'WCAG_2_4_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks',
        guidanceTags: [],
    },
    wcag242: {
        name: 'WCAG 2.4.2',
        linkTag: 'WCAG_2_4_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
        guidanceTags: [],
    },
    wcag243: {
        name: 'WCAG 2.4.3',
        linkTag: 'WCAG_2_4_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html',
        guidanceTags: [],
    },
    wcag244: {
        name: 'WCAG 2.4.4',
        linkTag: 'WCAG_2_4_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
        guidanceTags: [],
    },
    wcag245: {
        name: 'WCAG 2.4.5',
        linkTag: 'WCAG_2_4_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html',
        guidanceTags: [],
    },
    wcag246: {
        name: 'WCAG 2.4.6',
        linkTag: 'WCAG_2_4_6',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels',
        guidanceTags: [],
    },
    wcag247: {
        name: 'WCAG 2.4.7',
        linkTag: 'WCAG_2_4_7',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
        guidanceTags: [],
    },
    // wcag248: intentionally omitted, AAA
    // wcag249: intentionally omitted, AAA
    wcag251: {
        name: 'WCAG 2.5.1',
        linkTag: 'WCAG_2_5_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag252: {
        name: 'WCAG 2.5.2',
        linkTag: 'WCAG_2_5_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag253: {
        name: 'WCAG 2.5.3',
        linkTag: 'WCAG_2_5_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/label-in-name',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag254: {
        name: 'WCAG 2.5.4',
        linkTag: 'WCAG_2_5_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
    wcag255: {
        name: 'WCAG 2.5.5',
        linkTag: 'WCAG_2_5_5',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html',
        guidanceTags: [],
    },
    wcag311: {
        name: 'WCAG 3.1.1',
        linkTag: 'WCAG_3_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
        guidanceTags: [],
    },
    wcag312: {
        name: 'WCAG 3.1.2',
        linkTag: 'WCAG_3_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html',
        guidanceTags: [],
    },
    wcag321: {
        name: 'WCAG 3.2.1',
        linkTag: 'WCAG_3_2_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html',
        guidanceTags: [],
    },
    wcag322: {
        name: 'WCAG 3.2.2',
        linkTag: 'WCAG_3_2_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/on-input.html',
        guidanceTags: [],
    },
    wcag323: {
        name: 'WCAG 3.2.3',
        linkTag: 'WCAG_3_2_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation',
        guidanceTags: [],
    },
    wcag324: {
        name: 'WCAG 3.2.4',
        linkTag: 'WCAG_3_2_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification',
        guidanceTags: [],
    },
    // wcag325: intentionally omitted, AAA
    wcag331: {
        name: 'WCAG 3.3.1',
        linkTag: 'WCAG_3_3_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html',
        guidanceTags: [],
    },
    wcag332: {
        name: 'WCAG 3.3.2',
        linkTag: 'WCAG_3_3_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
        guidanceTags: [],
    },
    wcag333: {
        name: 'WCAG 3.3.3',
        linkTag: 'WCAG_3_3_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html',
        guidanceTags: [],
    },
    wcag334: {
        name: 'WCAG 3.3.4',
        linkTag: 'WCAG_3_3_4',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html',
        guidanceTags: [],
    },
    wcag411: {
        name: 'WCAG 4.1.1',
        linkTag: 'WCAG_4_1_1',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html',
        guidanceTags: [],
    },
    wcag412: {
        name: 'WCAG 4.1.2',
        linkTag: 'WCAG_4_1_2',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
        guidanceTags: [],
    },
    wcag413: {
        name: 'WCAG 4.1.3',
        linkTag: 'WCAG_4_1_3',
        link: 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html',
        guidanceTags: [guidanceTags.WCAG_2_1],
    },
};
