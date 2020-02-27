// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExpandCollapseAllButton,
    ExpandCollapseAllButtonProps,
} from 'common/components/cards/expand-collapse-all-button';
import {
    VisualHelperToggle,
    VisualHelperToggleProps,
} from 'common/components/cards/visual-helper-toggle';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './cards-visualization-modifier-buttons.scss';

export type CardsVisualizationModifierButtonsProps = ExpandCollapseAllButtonProps &
    VisualHelperToggleProps;

export type CardsVisualizationModifierButtons = ReactFCWithDisplayName<
    CardsVisualizationModifierButtonsProps
>;

export const ExpandCollapseOnlyModifierButtons: CardsVisualizationModifierButtons = NamedFC<
    CardsVisualizationModifierButtonsProps
>('CardsVisualizationExpandCollapseAllButton', props => {
    return (
        <div className={styles.cardsVisualizationModifiersContainer}>
            <ExpandCollapseAllButton {...props} />
        </div>
    );
});

export const ExpandCollapseVisualHelperModifierButtons: CardsVisualizationModifierButtons = NamedFC<
    CardsVisualizationModifierButtonsProps
>('CardsVisualizationModifierButtons', props => {
    return (
        <div className={styles.cardsVisualizationModifiersContainer}>
            <ExpandCollapseAllButton {...props} />
            <VisualHelperToggle {...props} />
        </div>
    );
});
