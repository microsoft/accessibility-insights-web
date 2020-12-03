// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { link } from 'content/link';

export const BestPractice: HyperlinkDefinition = {
    text: 'Best Practice',
    href: '',
};

// Maps from axe-core rule/result objects' tags property (eg, "wcag1411") to the guidance
// links shared by /content (eg, link.WCAG_1_4_11)
//
// Note: it is intentional that not all axe tags map to links! In particular:
// * cat.whatever are omitted (they are axe-specific and don't correspond to any official
//   accessibility standard)
// * wcag2a, wcag2aa, wcag21a, wcag21aa are omitted in favor of the more specific links for
//   individual wcag sections
// * experimental is omitted (we only show them at all in needs-review)
// * wcag123 tags for AAA requirements are omitted (to avoid user confusion about whether we support
//   AAA assessments)
function mapAxeTagToGuidanceLink(axeTag: string): HyperlinkDefinition | null {
    return (
        {
            'best-practice': BestPractice,
            wcag111: link.WCAG_1_1_1,
            wcag121: link.WCAG_1_2_1,
            wcag122: link.WCAG_1_2_2,
            wcag123: link.WCAG_1_2_3,
            wcag124: link.WCAG_1_2_4,
            wcag125: link.WCAG_1_2_5,
            wcag131: link.WCAG_1_3_1,
            wcag132: link.WCAG_1_3_2,
            wcag133: link.WCAG_1_3_3,
            wcag134: link.WCAG_1_3_4,
            wcag135: link.WCAG_1_3_5,
            wcag141: link.WCAG_1_4_1,
            wcag142: link.WCAG_1_4_2,
            wcag143: link.WCAG_1_4_3,
            wcag144: link.WCAG_1_4_4,
            wcag145: link.WCAG_1_4_5,
            wcag1410: link.WCAG_1_4_10,
            wcag1411: link.WCAG_1_4_11,
            wcag1412: link.WCAG_1_4_12,
            wcag1413: link.WCAG_1_4_13,
            wcag211: link.WCAG_2_1_1,
            wcag212: link.WCAG_2_1_2,
            wcag214: link.WCAG_2_1_4,
            wcag221: link.WCAG_2_2_1,
            wcag222: link.WCAG_2_2_2,
            // wcag223: intentionally omitted, AAA
            // wcag224: intentionally omitted, AAA
            wcag231: link.WCAG_2_3_1,
            wcag241: link.WCAG_2_4_1,
            wcag242: link.WCAG_2_4_2,
            wcag243: link.WCAG_2_4_3,
            wcag244: link.WCAG_2_4_4,
            wcag245: link.WCAG_2_4_5,
            wcag246: link.WCAG_2_4_6,
            wcag247: link.WCAG_2_4_7,
            // wcag248: intentionally omitted, AAA
            // wcag249: intentionally omitted, AAA
            wcag251: link.WCAG_2_5_1,
            wcag252: link.WCAG_2_5_2,
            wcag253: link.WCAG_2_5_3,
            wcag254: link.WCAG_2_5_4,
            wcag255: link.WCAG_2_5_5,
            wcag311: link.WCAG_3_1_1,
            wcag312: link.WCAG_3_1_2,
            wcag321: link.WCAG_3_2_1,
            wcag322: link.WCAG_3_2_2,
            wcag323: link.WCAG_3_2_3,
            wcag324: link.WCAG_3_2_4,
            // wcag325: intentionally omitted, AAA
            wcag331: link.WCAG_3_3_1,
            wcag332: link.WCAG_3_3_2,
            wcag333: link.WCAG_3_3_3,
            wcag334: link.WCAG_3_3_4,
            wcag411: link.WCAG_4_1_1,
            wcag412: link.WCAG_4_1_2,
            wcag413: link.WCAG_4_1_3,
        }[axeTag] ?? null
    );
}

export function mapAxeTagsToGuidanceLinks(axeTags?: string[]): HyperlinkDefinition[] {
    return (axeTags ?? []).map(mapAxeTagToGuidanceLink).filter(isNotNull);
}

function isNotNull<T>(maybeInstance?: T): maybeInstance is Exclude<T, null | undefined> {
    return maybeInstance != null;
}
