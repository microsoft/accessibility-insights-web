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

    return {
        snippet,
        link,
        sectionHeader,
        howToFixSection,
    };
};

export const MarkdownFormatter = createFormatter(truncate);
