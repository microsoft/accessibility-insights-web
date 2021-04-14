// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './expand-collapse-all-button.scss';

export type ExpandCollapseAllButtonDeps = {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export type ExpandCollapseAllButtonProps = {
    deps: ExpandCollapseAllButtonDeps;
    allCardsCollapsed: boolean;
};

export const ExpandCollapseAllButton = NamedFC<ExpandCollapseAllButtonProps>(
    'ExpandCollapseAllButton',
    props => {
        const { deps, allCardsCollapsed } = props;

        let expandCollapseAllButtonHandler = deps.cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';
        let iconName = 'ChevronDown';
        let ariaLabel: string | undefined = undefined;

        if (allCardsCollapsed) {
            expandCollapseAllButtonHandler = deps.cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
            iconName = 'ChevronRight';
            ariaLabel = 'Expand all rules to show failed instances.';
        }

        return (
            <ActionButton
                iconProps={{ iconName }}
                onClick={expandCollapseAllButtonHandler}
                aria-expanded={!allCardsCollapsed}
                aria-label={ariaLabel}
                className={styles.expandCollapseAllButton}
            >
                {buttonText}
            </ActionButton>
        );
    },
);
