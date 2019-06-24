// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RulesWithInstances, RulesWithInstancesDeps } from './rules-with-instances';

export type ResultSectionContentDeps = RulesWithInstancesDeps;

export type ResultSectionContentProps = {
    deps: ResultSectionContentDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContent = NamedSFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, outcomeType, deps, fixInstructionProcessor }) => {
        if (rules.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        return <RulesWithInstances deps={deps} rules={rules} outcomeType={outcomeType} fixInstructionProcessor={fixInstructionProcessor} />;
    },
);
