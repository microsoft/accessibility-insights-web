// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFormatter } from './markup-formatter';
import { truncateSnippet as truncate } from './truncate-snippet';

export const createFormatter = (truncateSnippet: (text: string) => string): MarkupFormatter => {
    const snippet = (text: string): string => {
        const truncated = truncateSnippet(text);

        return `\`${truncated}\``;
    };

    const link = (href: string, text?: string): string => {
        return `[${text || href}](${href})`;
    };

    const sectionHeader = (text: string) => {
        return `#### ${text}`;
    };

    const howToFixSection = (failureSummary: string): string => {
        return failureSummary
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    };

    const relatedPaths = (relatedPaths: string[]): string => {
        return relatedPaths.map(path => `- ${path}`).join('\n');
    };

    const sectionHeaderSeparator = () => '\n';

    const footerSeparator = () => null;

    const sectionSeparator = () => '\n';

    return {
        snippet,
        link,
        sectionHeader,
        howToFixSection,
        relatedPaths,
        sectionHeaderSeparator,
        footerSeparator,
        sectionSeparator,
    };
};

export const MarkdownFormatter = createFormatter(truncate);
