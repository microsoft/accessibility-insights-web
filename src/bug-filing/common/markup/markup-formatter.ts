// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type MarkupFormatter = {
    bold(text: string): string;
    snippet(text: string): string;
    link(href: string, text?: string): string;
    sectionSeparator(): string;
    newLine(): string;
    howToFixSection(failureSummary: string): string;
};
