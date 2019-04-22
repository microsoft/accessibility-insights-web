// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';

const createFactory = (): MarkupFactory => {
    const bold = (text: string): string => {
        return `**${text}**`;
    };

    const snippet = (text: string): string => {
        const maxSnippetLength = 256;
        let constrainedSnippet = text;

        if (text.length > maxSnippetLength) {
            constrainedSnippet = text.substr(0, maxSnippetLength) + '...';
        }

        return `\`${constrainedSnippet}\``;
    };

    const link = (href: string, text?: string): string => {
        return `[${text || href}](${href})`;
    };

    const sectionSeparator = (): string => {
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
        howToFixSection,
    };
};

export const MarkdownFactory = createFactory();
