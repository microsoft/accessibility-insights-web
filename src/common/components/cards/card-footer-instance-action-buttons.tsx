// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, DirectionalHint, IButton, Icon, TooltipHost } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling';
import {
    CardFooterMenuItem,
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { Toast, ToastDeps } from '../toast';
import styles from './card-footer-instance-action-buttons.scss';
import { CardInteractionSupport } from './card-interaction-support';
import { Button, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { Icons } from 'common/icons/fluentui-v9-icons';
import { LadyBugSolidIcon } from 'common/icons/lady-bug-solid-icon';
import { CopyRegular } from '@fluentui/react-icons';
import { MoreVerticalRegular } from '@fluentui/react-icons';

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

export class CardFooterInstanceActionButtons extends React.Component<CardFooterInstanceActionButtonsProps> {
    private toastRef: React.RefObject<Toast>;
    private fileIssueButtonRef: IButton | null;
    private kebabButtonRef: IButton | null;
    constructor(props: CardFooterInstanceActionButtonsProps) {
        super(props);
        this.toastRef = React.createRef();
    }

    public render(): JSX.Element | null {
        const menuItems = this.getMenuItems();
        if (menuItems.length === 0) {
            return null;
        }

        return (
            // The wrapper has to be a real element, not a <>, because we want the placeholder elements
            // the dialog/toast involve to be considered as part of the button for the purposes of layout
            // calculation in this component's parent.
            <div onKeyDown={event => event.stopPropagation()}>
                {this.renderButtons()}
                {this.renderCopyFailureDetailsToast()}
            </div>
        );
    }

    public renderButtons(): JSX.Element {
        if (this.props.narrowModeStatus?.isCardFooterCollapsed) {
            return this.renderKebabButton();
        } else {
            return this.renderExpandedButtons();
        }
    }

    public renderKebabButton(): JSX.Element {
        return (
            <>
                {/* <ActionButton
                    componentRef={ref => (this.kebabButtonRef = ref)}
                    ariaLabel={this.props.kebabMenuAriaLabel || 'More actions'}
                    menuIconProps={{
                        iconName: 'MoreActionsMenuIcon',
                        className: styles.kebabMenuIcon,
                    }}
                    menuProps={{
                        directionalHint: DirectionalHint.bottomRightEdge,
                        shouldFocusOnMount: true,
                        items: this.getMenuItems(),
                    }}
                /> */}
                <TooltipHost content="More actions">
                    <Menu>
                        <MenuTrigger>
                            <MenuButton appearance="transparent" icon={<MoreVerticalRegular />} />
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                {/* {overflowItems.map((item: any) => (
                                    <MenuItem icon={Icons[item?.iconProps?.iconName]} key={item.key} className={styles.commandBarButtonsSubmenu} {...item}>
                                         {item.children ? item.children : item.text}
                                        {item.children}
                                    </MenuItem>
                                ))} */}
                                {this.getMenuItems().map((item: any) => (
                                    <>

                                        <MenuItem className={styles.kebabMenuIcon} key={item.key} icon={Icons[item?.iconName]}  {...item}>

                                            {item?.text}
                                        </MenuItem>
                                        {/* <MenuItem icon={item?.iconProps?.iconName === 'Refresh' && <ArrowClockwiseRegular />} >
                                        {item?.text}
                                    </MenuItem> */}
                                    </>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </TooltipHost>
                <h3>2222</h3>
            </>
        );
    }

    public renderExpandedButtons(): JSX.Element {
        const menuItems = this.getMenuItems();

        return (
            <>
                {menuItems.map(props => (
                    <span key={props.key}>
                        {/* <ActionButton
                            onClick={props.onClick}
                            text={props.text}
                            iconProps={props.iconProps}
                            className={props.key}
                            componentRef={props.componentRef}
                        /> */}
                        <Button appearance='transparent' onClick={props.onClick}
                            icon={Icons[props.iconName]}
                            // icon={<CopyRegular />}
                            className={props.key}
                            size='medium'
                        // ref={props.componentRef}
                        >
                            {props.text}
                        </Button>
                        <h3>333</h3>
                    </span>
                ))}
            </>
        );
    }

    public renderCopyFailureDetailsToast(): JSX.Element | null {
        const { cardInteractionSupport } = this.props.deps;

        if (!cardInteractionSupport.supportsCopyFailureDetails) {
            return null;
        }

        return <Toast ref={this.toastRef} deps={this.props.deps} />;
    }

    private getMenuItems(): CardFooterMenuItem[] {
        return this.props.deps.cardFooterMenuItemsBuilder.getCardFooterMenuItems({
            ...this.props,
            toastRef: this.toastRef,
            fileIssueButtonRef: ref => (this.fileIssueButtonRef = ref),
            onIssueFilingSettingsDialogDismissed: this.focusButtonAfterDialogClosed,
        });
    }

    private focusButtonAfterDialogClosed = (): void => {
        if (this.props.narrowModeStatus?.isCardFooterCollapsed) {
            this.kebabButtonRef?.focus();
        } else {
            this.fileIssueButtonRef?.focus();
        }
    };
}
