// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { RuleDetailsGroup, RuleDetailsGroupDeps } from './rule-details-group';

export type ResultSectionContentDeps = RuleDetailsGroupDeps;

export type ResultSectionContentProps = {
    deps: ResultSectionContentDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
    showCongratsIfNotInstances?: boolean;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContent = NamedSFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, showDetails, outcomeType, showCongratsIfNotInstances, deps, fixInstructionProcessor }) => {
        let content = (
            <RuleDetailsGroup
                deps={deps}
                rules={rules}
                showDetails={showDetails}
                outcomeType={outcomeType}
                fixInstructionProcessor={fixInstructionProcessor}
            />
        );

        if (rules.length === 0 && showCongratsIfNotInstances) {
            content = <NoFailedInstancesCongrats />;
        }

        return content;
    },
);
