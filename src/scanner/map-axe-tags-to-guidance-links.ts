// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { GuidanceLink, guidanceTags } from 'common/types/store-data/guidance-links';
import {
    getGuidelineKeyByAxeTag,
    GuidelineMetadata,
    guidelineMetadata,
} from 'content/guideline-metadata';
import { link } from 'content/link';
import { concat, sortBy } from 'lodash';

export const BestPractice: GuidanceLink = {
    text: '',
    href: '',
    tags: [guidanceTags.BEST_PRACTICE],
};

export const AiScan: GuidanceLink = {
    text: '',
    href: '',
    tags: [guidanceTags.AI_SCAN],
};

const bestPracticeToGuidanceTagOverrideMapping = {
    'aria-allowed-role': ['wcag131', 'wcag412'],
    'presentation-role-conflict': ['wcag131'],
};

function addGuidanceTagOverrides(resultId: string, currentTags?: string[]) {
    return concat(currentTags ?? [], bestPracticeToGuidanceTagOverrideMapping[resultId] ?? []);
}

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
    if (axeTag === 'best-practice') {
        return BestPractice;
    }
    if (axeTag == 'ai-scan') {
        return AiScan;
    }
    const metadata: GuidelineMetadata = guidelineMetadata[getGuidelineKeyByAxeTag(axeTag)] ?? null;
    if (metadata === null) {
        return null;
    }

    return link[metadata.linkTag] ?? null;
}

export function mapAxeTagsToGuidanceLinks(
    resultId: string,
    axeTags?: string[],
): HyperlinkDefinition[] {
    const normalizedTags = addGuidanceTagOverrides(resultId, axeTags);
    const unsortedMaybeLinks = normalizedTags.map(mapAxeTagToGuidanceLink);
    const unsortedLinks = unsortedMaybeLinks.filter(isNotNull);
    const sortedLinks = sortBy(unsortedLinks, link => link.text);
    return sortedLinks;
}

function isNotNull<T>(maybeInstance?: T): maybeInstance is Exclude<T, null | undefined> {
    return maybeInstance != null;
}
