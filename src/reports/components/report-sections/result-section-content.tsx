// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { RulesWithInstances, RulesWithInstancesDeps } from './rules-with-instances';

export type ResultSectionContentDeps = RulesWithInstancesDeps;

export type ResultSectionContentProps = {
    deps: ResultSectionContentDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContent = NamedFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, outcomeType, fixInstructionProcessor, deps }) => {
        if (rules.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        return <RulesWithInstances deps={deps} rules={rules} outcomeType={outcomeType} fixInstructionProcessor={fixInstructionProcessor} />;
    },
);
