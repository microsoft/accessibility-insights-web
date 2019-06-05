// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GuidanceLinks } from '../../../../common/components/guidance-links';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';

export type RuleDetailProps = {
    rule: RuleResult;
    isHeader: boolean;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', ({ rule, children, isHeader }) => {
    const renderRuleName = () => (
        <span className="rule-details-id">
            <NewTabLink href={rule.helpUrl}>{rule.id}</NewTabLink>
        </span>
    );

    const renderDescription = () => {
        return <span className="rule-details-description">{rule.description}</span>;
    };

    const renderGuidanceLinks = () => {
        return <GuidanceLinks links={rule.guidanceLinks} />;
    };

    const extraProps = {
        role: undefined,
        ariaLevel: undefined,
    };

    if (isHeader) {
        extraProps.role = 'heading';
        extraProps.ariaLevel = '3';
    }

    return (
        <>
            <div className="rule-detail" {...extraProps}>
                {renderRuleName()}: {renderDescription()} ({renderGuidanceLinks()})
            </div>
            {children}
        </>
    );
});
