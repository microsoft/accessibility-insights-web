// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

import { HowToFixInstructions } from '../../../injected/adapters/scan-results-to-unified-results';

export type InstructionListBuilder = (title: string, checks: string[]) => string;
export const buildHowToFixInstructions = (instructions: HowToFixInstructions, listBuilder: InstructionListBuilder) => {
    const getInstructionList = (checks: string[], title: string) => {
        if (isEmpty(checks)) {
            return '';
        }

        const displayTitle = checks.length === 1 ? 'Fix the following: ' : title;
        return listBuilder(displayTitle, checks);
    };

    const all = instructions.all.concat(instructions.none);
    const oneOf = instructions.oneOf;
    const fixAllInstructions = getInstructionList(all, 'Fix ALL of the following: ');
    const fixAnyInstructions = getInstructionList(oneOf, 'Fix ONE of the following: ');
    return `${fixAllInstructions}${fixAnyInstructions}`;
};
