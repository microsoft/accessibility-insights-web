// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type MarkupFactory = {
    bold(text: string): string;
    snippet(text: string): string;
    link(href: string, text?: string): string;
};
