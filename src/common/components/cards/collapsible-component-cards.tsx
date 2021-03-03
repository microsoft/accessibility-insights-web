// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { SetFocusVisibility } from 'types/set-focus-visibility';
import * as styles from './collapsible-component-cards.scss';

export const collapsibleButtonAutomationId = 'collapsible-component-cards-button';

export type CollapsibleComponentCardsDeps = {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
    setFocusVisibility: SetFocusVisibility;
};

export interface CollapsibleComponentCardsProps {
    id: string;
    header: JSX.Element;
    content: JSX.Element;
    headingLevel: number;
    contentClassName?: string;
    containerAutomationId?: string;
    containerClassName?: string;
    buttonAriaLabel?: string;
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
        let contentWrapper: JSX.Element | null = null;
        let collapsedCSSClassName: string | null = 'collapsed';

        const showContent = isExpanded || false;

        if (showContent) {
            contentWrapper = (
                <div className={css(contentClassName, styles.collapsibleContainerContent)}>
                    {content}
                </div>
            );
            collapsedCSSClassName = null;
        }

        const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (event.nativeEvent.detail === 0) {
                // 0 => keyboard event
                deps.setFocusVisibility(true);
            }

            deps.cardSelectionMessageCreator.toggleRuleExpandCollapse(id, event);
        };

        return (
            <div
                data-automation-id={containerAutomationId}
                className={css(
                    containerClassName,
                    styles.collapsibleContainer,
                    collapsedCSSClassName,
                )}
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

export const CardsCollapsibleControl = (
    collapsibleControlProps: CollapsibleComponentCardsProps,
) => <CollapsibleComponentCards {...collapsibleControlProps} />;
