// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { RulesWithInstances } from './rules-with-instances';

export type ResultSectionContentProps = {
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContent = NamedSFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, outcomeType, fixInstructionProcessor }) => {
        if (rules.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        return <RulesWithInstances rules={rules} outcomeType={outcomeType} fixInstructionProcessor={fixInstructionProcessor} />;
    },
);
