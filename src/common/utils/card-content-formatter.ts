// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardResult } from 'common/types/store-data/card-view-model';

export function buildCopyContent(result: CardResult): string {
    // Helper functions
    const formatList = (items: string[]): string => items.map(item => `- ${item}`).join('\n');

    const formatUrlList = (urlInfos: any[]): string =>
        urlInfos.map(info => `- ${info.url}`).join('\n');

    const getHowToFixContent = (): string | undefined => {
        if (!result.resolution) return undefined;

        if ('howToFixSummary' in result.resolution) {
            return result.resolution.howToFixSummary;
        }

        if ('how-to-fix-web' in result.resolution) {
            const howToFixWeb = result.resolution['how-to-fix-web'];

            if (howToFixWeb.all?.length > 0) {
                return `Fix ALL of the following issues\n${formatList(howToFixWeb.all)}`;
            }

            if (howToFixWeb.any?.length > 0) {
                return `Fix ONE of the following issues\n${formatList(howToFixWeb.any)}`;
            }
        }

        return result.resolution.failureSummary;
    };

    // Build sections
    const sections: string[] = [];

    // Add Rule ID (always present)
    sections.push(`Rule ID: ${result.ruleId}`);

    // Add Path (use first available)
    const path =
        result.identifiers?.target ||
        result.identifiers?.identifier ||
        result.identifiers?.conciseName;
    if (path) {
        sections.push(`Path: ${path}`);
    }

    // Add Snippet
    if (result.descriptors?.snippet) {
        sections.push(`Snippet: ${result.descriptors.snippet}`);
    }

    // Add Related Paths
    if (result.descriptors?.relatedCssSelectors?.length) {
        sections.push(`Related Paths:\n${formatList(result.descriptors.relatedCssSelectors)}`);
    }

    // Add URLs
    if (result.identifiers?.urls?.urlInfos?.length) {
        sections.push(`URLs:\n${formatUrlList(result.identifiers.urls.urlInfos)}`);
    }

    // Add How to fix
    const howToFix = getHowToFixContent();
    if (howToFix) {
        sections.push(`How to fix:\n${howToFix}`);
    }

    return sections.join('\n\n');
}
