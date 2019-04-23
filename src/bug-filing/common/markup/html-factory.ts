// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { escape } from 'lodash';
import { MarkupFactory } from './markup-factory';
import { truncateSnippet as truncate } from './truncate-snippet';

export const createFactory = (truncateSnippet: (text: string) => string): MarkupFactory => {
    const bold = (text: string): string => {
        return `<b>${text}</b>`;
    };

    const snippet = (text: string): string => {
        const truncated = truncateSnippet(text);

        return `<code>${escape(truncated)}</code>`;
    };

    const link = (href: string, text?: string): string => {
        return `<a href="${href}">${text || href}</a>`;
    };

    const sectionSeparator = () => {
        return '<br><br>';
    };

    const newLine = () => {
        return '<br>';
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
        newLine,
        howToFixSection,
    };
};

export const HTMLFactory = createFactory(truncate);
