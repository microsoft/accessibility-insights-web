// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import * as styles from './collapsible-component-cards.scss';

export const collapsibleButtonAutomationId = 'collapsible-component-cards-button';

export type CollapsibleComponentCardsDeps = {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export interface CollapsibleComponentCardsProps {
    header: JSX.Element;
    content: JSX.Element;
    headingLevel: number;
    contentClassName?: string;
    containerAutomationId?: string;
    containerClassName?: string;
    buttonAriaLabel?: string;
    id?: string;
    deps: CollapsibleComponentCardsDeps;
    isExpanded?: boolean;
}

const CollapsibleComponentCards = NamedFC<CollapsibleComponentCardsProps>(
    'CollapsibleComponentCards',
    (props: CollapsibleComponentCardsProps) => {
        const {
            headingLevel,
            contentClassName,
            content,
            isExpanded,
            deps,
            buttonAriaLabel,
            containerAutomationId,
            containerClassName,
            header,
            id,
        } = props;

        const containerProps = { role: 'heading', 'aria-level': headingLevel };
        let contentWrapper = null;
        let collapsedCSSClassName = 'collapsed';

        const showContent = isExpanded || false;

        if (showContent) {
            contentWrapper = <div className={css(contentClassName, styles.collapsibleContainerContent)}>{content}</div>;
            collapsedCSSClassName = null;
        }

        const onClick = (event: React.MouseEvent<HTMLDivElement>) => deps.cardSelectionMessageCreator.toggleRuleExpandCollapse(id, event);

        return (
            <div
                data-automation-id={containerAutomationId}
                className={css(containerClassName, styles.collapsibleContainer, collapsedCSSClassName)}
            >
                <div {...containerProps}>
                    <ActionButton
                        data-automation-id={collapsibleButtonAutomationId}
                        className={styles.collapsibleControl}
                        onClick={onClick}
                        aria-expanded={showContent}
                        ariaLabel={buttonAriaLabel}
                    >
                        <span className={styles.collapsibleTitle}>{header}</span>
                    </ActionButton>
                </div>
                {contentWrapper}
            </div>
        );
    },
);

export const CardsCollapsibleControl = (collapsibleControlProps: CollapsibleComponentCardsProps) => (
    <CollapsibleComponentCards {...collapsibleControlProps} />
);
