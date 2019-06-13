// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RuleDetailsGroup } from './rule-details-group';

export type ResultSectionContentProps = {
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
    showCongratsIfNotInstances?: boolean;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContent = NamedSFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, showDetails, outcomeType, showCongratsIfNotInstances, fixInstructionProcessor }) => {
        let content = (
            <RuleDetailsGroup
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
