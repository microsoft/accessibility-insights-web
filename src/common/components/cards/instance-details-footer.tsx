// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { some, values } from 'lodash';
import { Icon, Label } from 'office-ui-fabric-react';
import * as React from 'react';
import { guidanceTags } from '../../../content/guidance-tags';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { foot, highlightDiv } from './card-footer.scss';
import { CardInteractionSupport } from './card-interaction-support';
import { CardKebabMenuButton, CardKebabMenuButtonDeps } from './card-kebab-menu-button';

export type HighlightState = 'visible' | 'hidden' | 'unavailable';

export type InstanceDetailsFooterDeps = {
    cardInteractionSupport: CardInteractionSupport;
} & CardKebabMenuButtonDeps;

export type InstanceDetailsFooterProps = {
    deps: InstanceDetailsFooterDeps;
    result: UnifiedResult;
    highlightState: HighlightState;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export const InstanceDetailsFooter = NamedFC<InstanceDetailsFooterProps>('InstanceDetailsFooter', props => {
    const { highlightState, deps, userConfigurationStoreData } = props;
    const { cardInteractionSupport } = deps;

    const anyInteractionSupport = some(values(cardInteractionSupport));
    if (!anyInteractionSupport) {
        return null;
    }

    const issueDetailsData: CreateIssueDetailsTextData = {
        rule: {
            id: 'id',
            description: 'description',
            url: 'url',
            guidance: [
                {
                    href: 'www.test.com',
                    text: 'text',
                    tags: [guidanceTags.WCAG_2_1],
                },
            ],
        },
        targetApp: {
            name: 'name',
            url: 'url',
        },
        element: {
            identifier: 'identifier',
            conciseName: 'conciseName',
        },
        howToFixSummary: 'howToFixSummary',
        snippet: 'snippet',
    };

    const kebabMenuIcon = () => {
        return (
            <CardKebabMenuButton deps={deps} userConfigurationStoreData={userConfigurationStoreData} issueDetailsData={issueDetailsData} />
        );
    };

    const HighlightButton = () => {
        const label = 'HighLight ' + highlightState;
        return (
            <div className={highlightDiv}>
                <Icon iconName="redEye" ariaLabel={label} />
                <Label>{label}</Label>
            </div>
        );
    };

    return (
        <div className={foot}>
            {HighlightButton()}
            {kebabMenuIcon()}
        </div>
    );
});
