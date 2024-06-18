// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './expand-collapse-all-button.scss';

export type ExpandCollapseAllButtonProps = {
    allCardsCollapsed: boolean;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export const ExpandCollapseAllButton = NamedFC<ExpandCollapseAllButtonProps>(
    'ExpandCollapseAllButton',
    props => {
        const { allCardsCollapsed, cardSelectionMessageCreator } = props;

        let expandCollapseAllButtonHandler = cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';
        let iconName = <ChevronDownRegular className={styles.chevronDownRegular} />;
        let ariaLabel: string | undefined = undefined;

        if (allCardsCollapsed) {
            expandCollapseAllButtonHandler = cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
            iconName = <ChevronRightRegular className={styles.chevronRightRegular} />;
            ariaLabel = 'Expand all rules to show failed instances.';
        }

        return (
            <Button
                appearance="transparent"
                icon={iconName}
                onClick={expandCollapseAllButtonHandler}
                aria-expanded={!allCardsCollapsed}
                aria-label={ariaLabel}
                className={styles.expandCollapseAllButton}
            >
                {buttonText}
            </Button>
        );
    },
);
