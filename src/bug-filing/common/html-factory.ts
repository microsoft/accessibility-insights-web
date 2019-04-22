// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';
import { escape } from 'lodash';

const createFactory = (): MarkupFactory => {
    const bold = (text: string): string => {
        return `<b>${text}</b>`;
    };

    const snippet = (text: string): string => {
        const maxSnippetLength = 256;
        let constrainedSnippet = text;

        if (text.length > maxSnippetLength) {
            constrainedSnippet = text.substr(0, maxSnippetLength) + '...';
        }

        return `<code>${escape(constrainedSnippet)}</code>`;
    };

    const link = (href: string, text?: string): string => {
        return `<a href="${href}">${text || href}</a>`;
    };

    const sectionSeparator = () => {
        return '<br><br>';
    };

    const howToFixSection = (failureSummary: string): string => {
        return escape(failureSummary)
            .replace(/\n  /g, '<br>- ')
            .replace(/\n /g, '<br> ')
            .replace(/\n/g, '<br>');
    };

    return {
        bold,
        snippet,
        link,
        sectionSeparator,
        howToFixSection,
    };
};

export const HTMLFactory = createFactory();
