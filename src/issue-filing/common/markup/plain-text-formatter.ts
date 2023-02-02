// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFormatter } from './markup-formatter';

const createFormatter = (): MarkupFormatter => {
    const snippet = (text: string): string => text.replace(/\s+/g, ' ').trim();

    const link = (href: string, text?: string): string => {
        if (text) {
            return `${text} - ${href}`;
        }

        return href;
    };

    const sectionHeader = (text: string): string => text;

    const howToFixSection = (failureSummary: string): string => `\n${failureSummary}`;

    const relatedPaths = (relatedPaths: string[]): string => {
        return relatedPaths.map(path => `\n  ${path}`).join('');
    };

    const sectionHeaderSeparator = () => ': ';

    const footerSeparator = () => '====\n\n';

    const newLine = () => '\n\n';

    return {
        snippet,
        link,
        sectionHeader,
        howToFixSection,
        relatedPaths,
        sectionHeaderSeparator,
        footerSeparator,
        sectionSeparator: newLine,
    };
};

export const PlainTextFormatter = createFormatter();
