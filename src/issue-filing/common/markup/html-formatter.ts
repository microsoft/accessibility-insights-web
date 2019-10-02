// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.import { escape, isEmpty } from 'lodash';
import { isEmpty } from 'lodash';

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

        return `<code>${escape(truncated)}</code>`;
    };

    const link = (href: string, text?: string): string => {
        return `<a href="${href}">${text || href}</a>`;
    };

    const sectionHeader = (text: string) => {
        return `<h4>${text}</h4>`;
    };

    const howToFixSection = (failureSummary: string): string => {
        return escape(failureSummary)
            .replace(/\n  /g, '<br>- ')
            .replace(/\n /g, '<br> ')
            .replace(/\n/g, '<br>');
    };

    const howToFix = (instructions: HowToFixInstructions) => {
        return howToFixInstructionBuilder(
            instructions,
            (title, checks) => `<div class="insights-fix-instruction-title">${title}</div>
                                    <ul class="insights-fix-instruction-list">
                                        ${checks.map(check => `<li>${check}</li>`).join()}
                                    </ul>
                                `,
        );
    };

    const sectionHeaderSeparator = () => null;

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

export const HTMLFormatter = createFormatter(truncate, buildHowToFixInstructions);
