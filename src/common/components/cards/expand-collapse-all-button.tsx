// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from '@fluentui/react';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
//import styles from './expand-collapse-all-button.scss';
import { Button, themeToTokensObject, webLightTheme } from '@fluentui/react-components';
import { ChevronDown32Regular, ChevronRight32Regular } from '@fluentui/react-icons';
import { useExpandCollapseAllButtonStyles } from 'common/components/cards/expand-collapse-all-button-styles';

export type ExpandCollapseAllButtonProps = {
    allCardsCollapsed: boolean;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export const ExpandCollapseAllButton = NamedFC<ExpandCollapseAllButtonProps>(
    'ExpandCollapseAllButton',
    props => {
        const getStyles = useExpandCollapseAllButtonStyles()
        const { allCardsCollapsed, cardSelectionMessageCreator } = props;

        let expandCollapseAllButtonHandler = cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';
        let iconName = <ChevronDown32Regular color={themeToTokensObject(webLightTheme)?.colorCompoundBrandStrokeHover} />;
        let ariaLabel: string | undefined = undefined;

        if (allCardsCollapsed) {
            expandCollapseAllButtonHandler = cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
            iconName = <ChevronRight32Regular color={themeToTokensObject(webLightTheme)?.colorCompoundBrandStrokeHover} />;
            ariaLabel = 'Expand all rules to show failed instances.';
        }

        return (
            // <ActionButton
            //     iconProps={{ iconName }}
            //     onClick={expandCollapseAllButtonHandler}
            //     aria-expanded={!allCardsCollapsed}
            //     aria-label={ariaLabel}
            //     className={styles.expandCollapseAllButton}
            // >
            //     <h3>555</h3>
            //     {buttonText}
            // </ActionButton>
            <Button size='medium'
                appearance="transparent"
                className={getStyles?.expandCollapseAllButton}
                aria-label={ariaLabel}
                aria-expanded={!allCardsCollapsed}
                onClick={expandCollapseAllButtonHandler}
                icon={iconName}>
                {buttonText}
            </Button>

        );
    },
);
