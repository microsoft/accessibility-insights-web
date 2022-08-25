// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, IButton } from '@fluentui/react';
import {
    CardFooterInstanceActionButtons,
    CardFooterInstanceActionButtonsDeps,
    CardFooterInstanceActionButtonsProps,
} from 'common/components/cards/card-footer-instance-action-buttons';
import {
    CardFooterMenuItem,
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsProps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { allCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe(CardFooterInstanceActionButtons, () => {
    let defaultProps: CardFooterInstanceActionButtonsProps;
    let defaultDeps: CardFooterInstanceActionButtonsDeps;
    let menuItemsBuilderMock: IMock<CardFooterMenuItemsBuilder>;
    let cardsViewControllerMock: IMock<CardsViewController>;

    const menuItems: CardFooterMenuItem[] = [
        {
            key: 'item1',
            text: 'item 1',
            onClick: () => null,
        },
        {
            key: 'item2',
            text: 'item 2',
            onClick: () => null,
        },
    ];

    beforeEach(() => {
        menuItemsBuilderMock = Mock.ofType<CardFooterMenuItemsBuilder>();
        cardsViewControllerMock = Mock.ofType<CardsViewController>();

        defaultDeps = {
            cardInteractionSupport: allCardInteractionsSupported,
            cardFooterMenuItemsBuilder: menuItemsBuilderMock.object,
            cardsViewController: cardsViewControllerMock.object,
        } as CardFooterInstanceActionButtonsDeps;

        defaultProps = {
            deps: defaultDeps,
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            issueDetailsData: {} as CreateIssueDetailsTextData,
        } as CardFooterInstanceActionButtonsProps;
    });

    it('renders as null with no menu items', () => {
        setupGetMenuItems([], defaultProps);

        const rendered = shallow(<CardFooterInstanceActionButtons {...defaultProps} />);

        expect(rendered.getElement()).toBeNull();
    });

    it('renders without copyFailureDetails supported', () => {
        const props = {
            ...defaultProps,
            deps: {
                ...defaultDeps,
                cardInteractionSupport: {
                    ...allCardInteractionsSupported,
                    supportsCopyFailureDetails: false,
                },
            },
        };
        setupGetMenuItems(menuItems, props);

        const rendered = shallow(<CardFooterInstanceActionButtons {...props} />);

        expect(rendered.debug()).toMatchSnapshot('component snapshot');
    });

    describe.each([true, false])('with isCardFooterCollapsed=%s', isCardFooterCollapsed => {
        beforeEach(() => {
            defaultProps.narrowModeStatus = { isCardFooterCollapsed } as NarrowModeStatus;
        });

        it('renders per snapshot', () => {
            setupGetMenuItems(menuItems, defaultProps);

            const rendered = shallow(<CardFooterInstanceActionButtons {...defaultProps} />);

            verifySnapshots(rendered);
        });

        function verifySnapshots(renderedElement: ShallowWrapper): void {
            expect(renderedElement.debug()).toMatchSnapshot('component snapshot');
            if (isCardFooterCollapsed) {
                expect(renderedElement.find(ActionButton).prop('menuProps')).toMatchSnapshot(
                    'action button menu props',
                );
            }
        }
    });

    it.each(['test-kebabmenuarialabel', undefined])(
        'renders per snapshot with %s aria label passed as prop',
        ariaLabel => {
            defaultProps.narrowModeStatus = { isCardFooterCollapsed: true } as NarrowModeStatus;

            const newProps = {
                ...defaultProps,
                kebabMenuAriaLabel: ariaLabel,
            };
            setupGetMenuItems(menuItems, newProps);

            const rendered = shallow(<CardFooterInstanceActionButtons {...newProps} />);

            expect(rendered.debug()).toMatchSnapshot('component snapshot');
            expect(rendered.find(ActionButton).prop('menuProps')).toMatchSnapshot(
                'action button menu props',
            );
        },
    );

    it('onIssueFilingSettingsDialogDismissed focuses kebab button', async () => {
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: true } as NarrowModeStatus;
        const kebabButtonMock = Mock.ofType<IButton>();
        let menuItemsProps: CardFooterMenuItemsProps;

        menuItemsBuilderMock
            .setup(m =>
                m.getCardFooterMenuItems(
                    It.isObjectWith(defaultProps as unknown as CardFooterMenuItemsProps),
                ),
            )
            .returns((props: CardFooterMenuItemsProps) => {
                menuItemsProps = props;
                return menuItems;
            });

        const rendered = shallow(<CardFooterInstanceActionButtons {...defaultProps} />);

        // call ref callback to set rendered component's ref to our button mock
        const kebabButtonRefCallback = rendered.find(ActionButton).prop('componentRef') as (
            ref: IButton,
        ) => void;
        kebabButtonRefCallback(kebabButtonMock.object);

        menuItemsProps.onIssueFilingSettingsDialogDismissed();

        kebabButtonMock.verify(k => k.focus(), Times.once());
    });

    it('File issue button is focused when issue filing settings dialog is dismissed', async () => {
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: false } as NarrowModeStatus;
        const fileIssueButtonMock = Mock.ofType<IButton>();

        let menuItemsProps: CardFooterMenuItemsProps;
        menuItemsBuilderMock
            .setup(m =>
                m.getCardFooterMenuItems(
                    It.isObjectWith(defaultProps as unknown as CardFooterMenuItemsProps),
                ),
            )
            .returns(props => {
                menuItemsProps = props;
                return menuItems;
            });

        shallow(
            <CardFooterInstanceActionButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );

        // call ref callback to set rendered component's ref to our button mock
        const buttonRefCallback = menuItemsProps.fileIssueButtonRef as (button: IButton) => void;
        buttonRefCallback(fileIssueButtonMock.object);

        menuItemsProps.onIssueFilingSettingsDialogDismissed();

        fileIssueButtonMock.verify(f => f.focus(), Times.once());
    });

    function setupGetMenuItems(
        menuItems: CardFooterMenuItem[],
        expectedProps: CardFooterInstanceActionButtonsProps,
    ): void {
        menuItemsBuilderMock
            .setup(m =>
                m.getCardFooterMenuItems(
                    It.isObjectWith(expectedProps as unknown as CardFooterMenuItemsProps),
                ),
            )
            .returns(() => menuItems);
    }
});
