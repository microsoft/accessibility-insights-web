// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    cardsVisualizationModifiersContainer,
    expandCollapseAllButton,
    visualHelperToggle,
} from 'common/components/cards/cards-visualization-modifiers-buttons.scss';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { ActionButton, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';

export type CardsVisualizationModifierButtonsDeps = {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export type CardsVisualizationModifierButtonsProps = {
    deps: CardsVisualizationModifierButtonsDeps;
    visualHelperEnabled: boolean;
    allCardsCollapsed: boolean;
};

export const CardsVisualizationModifierButtons = NamedFC<CardsVisualizationModifierButtonsProps>(
    'CardsVisualizationModifierButtons',
    props => {
        const { deps, visualHelperEnabled, allCardsCollapsed } = props;

        let expandCollapseAllButtonHandler = deps.cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';
        let iconName = 'ChevronDown';

        if (allCardsCollapsed) {
            expandCollapseAllButtonHandler = deps.cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
            iconName = 'ChevronRight';
        }

        return (
            <div className={cardsVisualizationModifiersContainer}>
                <ActionButton
                    iconProps={{ iconName }}
                    onClick={expandCollapseAllButtonHandler}
                    aria-expanded={allCardsCollapsed}
                    className={expandCollapseAllButton}
                >
                    {buttonText}
                </ActionButton>
                <Toggle
                    onClick={deps.cardSelectionMessageCreator.toggleVisualHelper}
                    label="Visual helper"
                    checked={visualHelperEnabled}
                    className={visualHelperToggle}
                />
            </div>
        );
    },
);
