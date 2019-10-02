// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixInstructions } from '../../../injected/adapters/scan-results-to-unified-results';

export type MarkupFormatter = {
    snippet(text: string): string;
    link(href: string, text?: string): string;
    sectionHeader(text: string): string;
    howToFixSection(failureSummary: string): string;
    howToFix(instructions: HowToFixInstructions): string;
    sectionHeaderSeparator(): string;
    footerSeparator(): string;
    sectionSeparator(): string;
};
