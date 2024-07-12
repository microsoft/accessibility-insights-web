// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TooltipHost } from '@fluentui/react';
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
import { MoreVerticalRegular } from '@fluentui/react-icons';
import {
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { Icons } from 'common/icons/fluentui-v9-icons';
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
    const fileIssueButtonRef = null;
    const kebabButtonRef = React.useRef(null);

    const focusButtonAfterDialogClosed = (): void => {
        if (props?.narrowModeStatus?.isCardFooterCollapsed) {
            kebabButtonRef?.current?.focus();
        } else {
            fileIssueButtonRef?.focus();
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
            <>
                <TooltipHost content="More actions">
                    <Menu>
                        <MenuTrigger>
                            <MenuButton appearance="transparent" icon={<MoreVerticalRegular />} />
                        </MenuTrigger>
                        <MenuPopover
                            style={{
                                padding: 'unset !important',
                                border: 'unset !important',
                                borderRadius: 'unset !important',
                            }}
                        >
                            <MenuList>
                                {getMenuItems().map((item: any) => (
                                    <>
                                        <MenuItem
                                            componentRef={ref => (kebabButtonRef.current = ref)}
                                            className={styles.kebabMenuIcon}
                                            key={item.key}
                                            icon={Icons[item?.iconName]}
                                            {...item}
                                        >
                                            {item?.text}
                                        </MenuItem>
                                    </>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </TooltipHost>
                <h3>2222</h3>
            </>
        );
    };

    const renderExpandedButtons = () => {
        const menuItems = getMenuItems();
        console.log('here---->', menuItems);
        return (
            <>
                {menuItems.map(props => (
                    <span key={props.key}>
                        <Button
                            as="button"
                            appearance="transparent"
                            onClick={props.onClick}
                            icon={Icons[props.iconName]}
                            className={props.key}
                            size="medium"
                            ref={props.componentRef}
                        >
                            {props.text}
                        </Button>
                    </span>
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

    return (
        <div onKeyDown={event => event.stopPropagation()}>
            {renderButtons()}
            {renderCopyFailureDetailsToast()}
        </div>
    );
};
