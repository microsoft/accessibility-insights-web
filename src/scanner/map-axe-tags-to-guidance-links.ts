// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { link } from 'content/link';

export const BestPractice: HyperlinkDefinition = {
    text: 'Best Practice',
    href: '',
};

// Maps from "wcag1411" to link.WCAG_1_4_11
function mapAxeTagToGuidanceLink(axeTag: string): HyperlinkDefinition | null {
    if (axeTag === 'best-practice') {
        return BestPractice;
    }
    const maybeMatch = /^wcag(\d)(\d)(\d+)$/.exec(axeTag);
    if (maybeMatch == null) {
        return null;
    }
    const [_, major, minor, patch] = maybeMatch;
    const linkIndexer = `WCAG_${major}_${minor}_${patch}`;
    return link[linkIndexer] ?? null;
}

export function mapAxeTagsToGuidanceLinks(axeTags?: string[]): HyperlinkDefinition[] {
    return (axeTags ?? []).map(mapAxeTagToGuidanceLink).filter(isNotNull);
}

function isNotNull<T>(maybeInstance?: T): maybeInstance is Exclude<T, null | undefined> {
    return maybeInstance != null;
}
