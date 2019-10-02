// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixInstructions } from '../../../injected/adapters/scan-results-to-unified-results';
import { buildHowToFixInstructions, InstructionListBuilder } from './how-to-fix-instruction-builder';
import { MarkupFormatter } from './markup-formatter';

const createFormatter = (
    howToFixInstructionBuilder: (instructions: HowToFixInstructions, listBuilder: InstructionListBuilder) => string,
): MarkupFormatter => {
    const snippet = (text: string): string => text.replace(/\s+/g, ' ').trim();

    const link = (href: string, text?: string): string => {
        if (text) {
            return `${text} - ${href}`;
        }

        return href;
    };

    const sectionHeader = (text: string): string => text;

    const howToFixSection = (failureSummary: string): string => `\n${failureSummary}`;

    const howToFix = (instructions: HowToFixInstructions) => {
        return howToFixInstructionBuilder(instructions, (title, checks) => `\n${title}${checks.map(check => `    ${check}`).join()}`);
    };

    const sectionHeaderSeparator = () => ': ';

    const footerSeparator = () => '====\n\n';

    const newLine = () => '\n\n';

    return {
        snippet,
        link,
        sectionHeader,
        howToFixSection,
        sectionHeaderSeparator,
        footerSeparator,
        sectionSeparator: newLine,
        howToFix,
    };
};

export const PlainTextFormatter = createFormatter(buildHowToFixInstructions);
