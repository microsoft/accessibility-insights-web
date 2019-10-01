// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { some, values } from 'lodash';
import { CommandBarButton } from 'office-ui-fabric-react';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { foot, highlightButton, kebabMenuButton } from '../../../reports/components/instance-details.scss';
import { CardInteractionSupport } from './card-interaction-support';

export type HighlightState = 'visible' | 'hidden' | 'unavailable';

export type InstanceDetailsFooterDeps = {
    cardInteractionSupport: CardInteractionSupport;
};

export type InstanceDetailsFooterProps = {
    deps: InstanceDetailsFooterDeps;
    result: UnifiedResult;
    highlightState: HighlightState;
};

export const InstanceDetailsFooter = NamedFC<InstanceDetailsFooterProps>('InstanceDetailsFooter', props => {
    const { highlightState, deps } = props;
    const { cardInteractionSupport } = deps;

    const anyInteractionSupport = some(values(cardInteractionSupport));
    if (!anyInteractionSupport) {
        return null;
    }

    const kebabMenuIcon = () => {
        const label = '';
        const icon: IIconProps = { iconName: 'moreVertical' };
        return <CommandBarButton iconProps={icon} text={label} disabled={false} checked={false} className={kebabMenuButton} />;
    };

    const HighlightButton = () => {
        const label = 'HighLight Buttons ' + highlightState;
        const icon: IIconProps = { iconName: 'redEye' };
        return <CommandBarButton iconProps={icon} text={label} disabled={false} checked={false} className={highlightButton} />;
    };

    return (
        <div className={foot}>
            {HighlightButton()}
            {kebabMenuIcon()}
        </div>
    );
});
