// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';

const createFactory = (): MarkupFactory => {
    const bold = (text: string): string => {
        return `**${text}**`;
    };

    const snippet = (text: string): string => {
        return `\`${text.replace(/\s+/g, ' ').trim()}\``;
    };

    const link = (href: string, text?: string) => {
        return `[${text || href}](${href})`;
    };

    return {
        bold,
        snippet,
        link,
    };
};

export const MarkdownFactory = createFactory();
