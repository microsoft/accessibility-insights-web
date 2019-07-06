// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { GuidanceLinks } from '../../../../common/components/guidance-links';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../../common/get-guidance-tags-from-guidance-links';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceDetails } from './instance-details';

export type InstanceDetailsGroupDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export type InstanceDetailsGroupProps = {
    deps: InstanceDetailsGroupDeps;
    rule: RuleResult;
    fixInstructionProcessor: FixInstructionProcessor;
};

export const InstanceDetailsGroup = NamedSFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    const { fixInstructionProcessor, rule } = props;
    const { nodes } = rule;

    const renderRuleLink = () => {
        const ruleId = rule.id;
        const ruleUrl = rule.helpUrl;
        return (
            <span className="rule-details-id">
                <NewTabLink href={ruleUrl}>More information about {ruleId}</NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => <GuidanceLinks links={rule.guidanceLinks} />;

    return (
        <>
            <div className="rule-more-resources">
                <div>Resources for this rule</div>
                {renderRuleLink()}
                {renderGuidanceLinks()}
            </div>
            <ul className="instance-details-list" aria-label="failed instances with path, snippet and how to fix information">
                {nodes.map((node, index) => (
                    <li key={`instance-details-${index}`}>
                        <InstanceDetails {...{ index, ...node, fixInstructionProcessor: fixInstructionProcessor }} />
                    </li>
                ))}
            </ul>
        </>
    );
});
