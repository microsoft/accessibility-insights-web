// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, themeToTokensObject, webLightTheme } from '@fluentui/react-components';
import { ChevronDown32Regular, ChevronRight32Regular } from '@fluentui/react-icons';
import { useExpandCollapseAllButtonStyles } from 'common/components/cards/expand-collapse-all-button-styles';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type ExpandCollapseAllButtonProps = {
    allCardsCollapsed: boolean;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export const ExpandCollapseAllButton = NamedFC<ExpandCollapseAllButtonProps>(
    'ExpandCollapseAllButton',
    props => {
        const getStyles = useExpandCollapseAllButtonStyles();
        const { allCardsCollapsed, cardSelectionMessageCreator } = props;

        let expandCollapseAllButtonHandler = cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';
        let iconName = <FluentUIV9Icon iconName='ChevronDown32Regular' />
        let ariaLabel: string | undefined = undefined;

        if (allCardsCollapsed) {
            expandCollapseAllButtonHandler = cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
            iconName = <FluentUIV9Icon iconName='ChevronRight32Regular' />

            ariaLabel = 'Expand all rules to show failed instances.';
        }

        return (
            <Button
                size="medium"
                appearance="transparent"
                className={getStyles?.expandCollapseAllButton}
                aria-label={ariaLabel}
                aria-expanded={!allCardsCollapsed}
                onClick={expandCollapseAllButtonHandler}
                icon={iconName}
            >
                {buttonText}
            </Button>
        );
    },
);
