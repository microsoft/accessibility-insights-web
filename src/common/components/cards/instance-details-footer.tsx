// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { some, values } from 'lodash';
import { CommandBarButton, DefaultButton, IconButton, Label, ActionButton } from 'office-ui-fabric-react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { foot, highlightButton, kebabMenuButton } from './card-footer.scss';

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
        return (
            <div className={kebabMenuButton}>
                <ActionButton
                    iconProps={{
                        iconName: 'moreVertical',
                    }}
                    text=""
                />
            </div>
        );
    };

    const HighlightButton = () => {
        const label = 'HighLight Buttons ' + highlightState;
        return (
            <div className={highlightButton}>
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
