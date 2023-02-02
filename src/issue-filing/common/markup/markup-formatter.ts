// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type MarkupFormatter = {
    snippet(text: string): string;
    link(href: string, text?: string): string;
    sectionHeader(text: string): string;
    howToFixSection(failureSummary: string): string;
    relatedPaths(relatedPaths: string[]): string;
    sectionHeaderSeparator(): string | null;
    footerSeparator(): string | null;
    sectionSeparator(): string;
};
