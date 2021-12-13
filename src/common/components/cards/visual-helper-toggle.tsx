// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { css, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './visual-helper-toggle.scss';

export type VisualHelperToggleProps = {
    visualHelperEnabled: boolean;
    className?: string;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export const VisualHelperToggle = NamedFC<VisualHelperToggleProps>('VisualHelperToggle', props => {
    return (
        <Toggle
            onClick={props.cardSelectionMessageCreator.toggleVisualHelper}
            label="Visual helper"
            checked={props.visualHelperEnabled}
            className={css(styles.visualHelperToggle, props.className)}
        />
    );
});
