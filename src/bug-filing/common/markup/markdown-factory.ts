// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';
import { truncateSnippet as truncate } from './truncate-snippet';

export const createFactory = (truncateSnippet: (text: string) => string): MarkupFactory => {
    const bold = (text: string): string => {
        return `**${text}**`;
    };

    const snippet = (text: string): string => {
        const truncated = truncateSnippet(text);

        return `\`${truncated}\``;
    };

    const link = (href: string, text?: string): string => {
        return `[${text || href}](${href})`;
    };

    const sectionSeparator = (): string => {
        return '';
    };

    const newLine = (): string => {
        return '';
    };

    const howToFixSection = (failureSummary: string): string => {
        return failureSummary
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    };

    return {
        bold,
        snippet,
        link,
        sectionSeparator,
        newLine,
        howToFixSection,
    };
};

export const MarkdownFactory = createFactory(truncate);
