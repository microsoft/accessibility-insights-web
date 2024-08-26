// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { registerIcons } from '@fluentui/react/lib/Styling';
import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from '@fluentui/react-components';
import {
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { Toast, ToastDeps } from '../toast';
import styles from './card-footer-instance-action-buttons.scss';
import { CardInteractionSupport } from './card-interaction-support';

registerIcons({
    icons: {
        MoreActionsMenuIcon: <MoreActionsMenuIcon />,
    },
});

export type CardFooterInstanceActionButtonsDeps = {
    cardInteractionSupport: CardInteractionSupport;
    cardFooterMenuItemsBuilder: CardFooterMenuItemsBuilder;
    cardsViewController: CardsViewController;
} & ToastDeps &
    CardFooterMenuItemsDeps;

export interface CardFooterInstanceActionButtonsProps {
    deps: CardFooterInstanceActionButtonsDeps;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    issueDetailsData: CreateIssueDetailsTextData;
    kebabMenuAriaLabel?: string;
    narrowModeStatus?: NarrowModeStatus;
}

export const CardFooterInstanceActionButtons = NamedFC<CardFooterInstanceActionButtonsProps>(
    'CardFooterInstanceActionButtonsProps',
    props => {
        const toastRef = React.useRef(null);
        const fileIssueButtonRef: any = React.useRef(null);
        const kebabButtonRef: any = React.useRef(null);

        const focusButtonAfterDialogClosed = (): void => {
            if (props?.narrowModeStatus?.isCardFooterCollapsed) {
                kebabButtonRef?.current?.focus();
            } else {
                fileIssueButtonRef?.current?.removeAttribute('textprediction');
                fileIssueButtonRef?.current?.setAttribute('writingsuggestions', 'false');
                fileIssueButtonRef?.current?.focus();
            }
        };

        const getMenuItems = () => {
            return props.deps.cardFooterMenuItemsBuilder.getCardFooterMenuItems({
                ...props,
                toastRef: toastRef,
                fileIssueButtonRef: ref => (fileIssueButtonRef.current = ref),
                onIssueFilingSettingsDialogDismissed: focusButtonAfterDialogClosed,
            });
        };

        const renderCopyFailureDetailsToast = () => {
            const { cardInteractionSupport } = props.deps;

            if (!cardInteractionSupport.supportsCopyFailureDetails) {
                return null;
            }

            if (props?.narrowModeStatus?.isCardFooterCollapsed) {
                kebabButtonRef?.current?.focus();
            }

            return <Toast ref={toastRef} deps={props.deps} />;
        };

        const renderKebabButton = () => {
            return (
                <Menu>
                    <MenuTrigger>
                        <MenuButton
                            className={styles.menuButton}
                            ref={ref => (kebabButtonRef.current = ref)}
                            appearance="transparent"
                            shape="square"
                            aria-label={props?.kebabMenuAriaLabel}
                            icon={<FluentUIV9Icon iconName="MoreVerticalRegular" />}
                        />
                    </MenuTrigger>
                    <MenuPopover className={styles.menuPopover}>
                        <MenuList>
                            {getMenuItems().map((item: any, index: number) => (
                                <MenuItem
                                    className={styles.kebabMenuIcon}
                                    key={`${item.key}-${index}-kebabMenuItem`}
                                    icon={<FluentUIV9Icon iconName={item?.iconName} />}
                                    {...item}
                                >
                                    {item?.text}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            );
        };

        const renderExpandedButtons = () => {
            const menuItems = getMenuItems();
            return (
                <>
                    {menuItems.map(menuItem => (
                        <Button
                            as="button"
                            appearance="transparent"
                            onClick={menuItem.onClick}
                            icon={<FluentUIV9Icon iconName={menuItem?.iconName} />}
                            className={styles[menuItem.key]}
                            size="medium"
                            key={`${menuItem.key}-expandedButtons`}
                        >
                            {menuItem.text}
                        </Button>
                    ))}
                </>
            );
        };

        const renderButtons = () => {
            if (props.narrowModeStatus?.isCardFooterCollapsed) {
                return renderKebabButton();
            } else {
                return renderExpandedButtons();
            }
        };

        const menuItems = getMenuItems();
        const menuItemsJsx =
            menuItems?.length === 0 ? null : (
                <div onKeyDown={event => event.stopPropagation()}>
                    {renderButtons()}
                    {renderCopyFailureDetailsToast()}
                </div>
            );

        return menuItemsJsx;
    },
);
