// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixInstructions } from '../../../injected/adapters/scan-results-to-unified-results';
import { buildHowToFixInstructions, InstructionListBuilder } from './how-to-fix-instruction-builder';
import { MarkupFormatter } from './markup-formatter';
import { truncateSnippet as truncate } from './truncate-snippet';

export const createFormatter = (
    truncateSnippet: (text: string) => string,
    howToFixInstructionBuilder: (instructions: HowToFixInstructions, listBuilder: InstructionListBuilder) => string,
): MarkupFormatter => {
    const snippet = (text: string): string => {
        const truncated = truncateSnippet(text);

        return `\`${truncated}\``;
    };

    const link = (href: string, text?: string): string => {
        return `[${text || href}](${href})`;
    };

    const sectionHeader = (text: string) => {
        return `#### ${text}`;
    };

    const howToFixSection = (failureSummary: string): string => {
        return failureSummary
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    };

    const howToFix = (instructions: HowToFixInstructions) => {
        return howToFixInstructionBuilder(instructions, (title, checks) => `${title}\n${checks.map(check => `    ${check}`).join('\n')}\n`);
    };

    const sectionHeaderSeparator = () => '\n';

    const footerSeparator = () => null;

    const sectionSeparator = () => '\n';

    return {
        snippet,
        link,
        sectionHeader,
        howToFixSection,
        sectionHeaderSeparator,
        footerSeparator,
        sectionSeparator,
    };
};

export const MarkdownFormatter = createFormatter(truncate, buildHowToFixInstructions);
