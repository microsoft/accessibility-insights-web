// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { escape } from 'lodash';
import { MarkupFormatter } from './markup-formatter';
import { truncateSnippet as truncate } from './truncate-snippet';

export const createFormatter = (truncateSnippet: (text: string) => string): MarkupFormatter => {
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

export const HTMLFormatter = createFormatter(truncate);
