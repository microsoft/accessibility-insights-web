// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
import { render, renderHook, RenderResult, screen } from '@testing-library/react';
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
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { Toast } from '../../../../../../common/components/toast';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react-components');
jest.mock('../../../../../../common/components/toast');

jest.mock('common/icons/fluentui-v9-icons')
describe(CardFooterInstanceActionButtons, () => {
    mockReactComponents([
        Toast,
        Button,
        MenuItem,
        Menu,
        MenuTrigger,
        MenuPopover,
        MenuList,
        Tooltip,
    ]);

    let defaultProps: CardFooterInstanceActionButtonsProps;
    let defaultDeps: CardFooterInstanceActionButtonsDeps;
    let menuItemsBuilderMock: IMock<CardFooterMenuItemsBuilder>;
    let cardsViewControllerMock: IMock<CardsViewController>;

    const menuItems: CardFooterMenuItem[] = [
        {
            key: 'item1',
            text: 'item 1',
            onClick: () => null
        },
        {
            key: 'item2',
            text: 'item 2',
            onClick: () => null
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

        const renderResult = render(<CardFooterInstanceActionButtons {...defaultProps} />);
        expect(renderResult.container.firstChild).toBeNull();
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

        const renderResult = render(<CardFooterInstanceActionButtons {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot('component snapshot');
    });

    describe.each([true, false])('with isCardFooterCollapsed=%s', isCardFooterCollapsed => {
        beforeEach(() => {
            defaultProps.narrowModeStatus = { isCardFooterCollapsed } as NarrowModeStatus;
        });

        it('renders per snapshot', () => {
            setupGetMenuItems(menuItems, defaultProps);

            const renderResult = render(<CardFooterInstanceActionButtons {...defaultProps} />);

            verifySnapshots(renderResult);
        });

        function verifySnapshots(renderedElement: RenderResult): void {
            useOriginalReactElements('@fluentui/react-components', [
                'Tooltip',
                'Menu',
                'MenuTrigger',
                'MenuButton',
                'MenuPopover',
                'MenuList',
                'MenuItem',
            ]);
            expect(renderedElement.asFragment()).toMatchSnapshot('component snapshot');
            if (isCardFooterCollapsed) {
                expect(renderedElement.asFragment()).toMatchSnapshot('kebab button menu');
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

            const renderResult = render(<CardFooterInstanceActionButtons {...newProps} />);

            expect(renderResult.asFragment()).toMatchSnapshot('component snapshot');
            expectMockedComponentPropsToMatchSnapshots([MenuButton], 'action button menu props');
        },
    );

    it('onIssueFilingSettingsDialogDismissed focus kebab button', async () => {
        useOriginalReactElements('@fluentui/react-components', [
            'Button'
        ]);
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: true } as NarrowModeStatus;
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
        const result = render(<CardFooterInstanceActionButtons {...defaultProps} />);
        menuItemsProps.onIssueFilingSettingsDialogDismissed();
        jest.spyOn(menuItemsProps, 'onIssueFilingSettingsDialogDismissed')
        const getButton = result.getByRole('button');

        expect(document.activeElement).toBe(getButton);
    });

    it('File issue button is focused when issue filing settings dialog is dismissed', async () => {
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: false } as NarrowModeStatus;
        const fileIssueButtonMock = Mock.ofType<HTMLButtonElement>();

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

        render(
            <CardFooterInstanceActionButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );

        // call ref callback to set rendered component's ref to our button mock
        const buttonRefCallback = menuItemsProps.fileIssueButtonRef as any;
        console.log('buttonRef===>', buttonRefCallback)
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
