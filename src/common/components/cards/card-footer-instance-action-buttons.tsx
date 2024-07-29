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
    Tooltip,
} from '@fluentui/react-components';
import {
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
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

export const CardFooterInstanceActionButtons = props => {
    const toastRef = React.useRef(null);
    const fileIssueButtonRef = React.useRef(null);
    const kebabButtonRef = React.useRef(null);

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
                        aria-label={props?.kebabMenuAriaLabel}
                        icon={<FluentUIV9Icon iconName="MoreVerticalRegular" />}
                    />
                </MenuTrigger>
                <MenuPopover
                    style={{
                        padding: 'unset !important',
                        border: 'unset !important',
                        borderRadius: 'unset !important',
                    }}
                >
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
        console.log('inside expanded button');
        return (
            <>
                {menuItems.map(props => (
                    <Button
                        as="button"
                        appearance="transparent"
                        onClick={props.onClick}
                        icon={<FluentUIV9Icon iconName={props?.iconName} />}
                        className={styles[props.key]}
                        size="medium"
                        ref={ref => (props.componentRef = ref)}
                        key={`${props.key}-expandedButtons`}
                    >
                        {props.text}
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
    console.log('here--->', menuItems?.length)
    const menuItemsJsx =
        menuItems?.length == 0 ? null : (
            <div onKeyDown={event => event.stopPropagation()}>
                {renderButtons()}
                {renderCopyFailureDetailsToast()}
            </div>
        );

    return menuItemsJsx;
};
