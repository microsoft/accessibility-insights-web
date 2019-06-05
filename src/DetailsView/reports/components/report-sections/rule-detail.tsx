// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import * as React from 'react';
import { GuidanceLinks } from '../../../../common/components/guidance-links';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';

export type RuleDetailProps = {
    rule: RuleResult;
    showDetails?: boolean;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', ({ rule, children, showDetails }) => {
    // const chevronClickHandler = eve => {
    //     console.log('here', eve);
    //     eve.target.classList.contains('closed') ? console.log('whatever') : console.log('open');
    // };
    const handleClick = e => {
        console.log('The link was clicked.', e);
    };

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

    return (
        <>
            <div className="rule-detail">
                <input type="checkbox" id="cb1" className="test-input" />
                {showDetails ? (
                    <>
                        <label htmlFor="cb1" />
                        <div className={classNames('chevron', 'closed')} />
                    </>
                ) : null}
                {renderRuleName()}: {renderDescription()} ({renderGuidanceLinks()})
            </div>
            {children}
        </>
    );
});
