// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from '@fluentui/react-components';
import { render, RenderResult, screen } from '@testing-library/react';
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
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../mock-helpers/mock-module-helpers';
import { IButton } from '@fluentui/react';
import { setAttribute } from '@fluentui/react/lib/components/KeytipData/useKeytipRef';

jest.mock('@fluentui/react-components');
jest.mock('../../../../../../common/components/toast');
describe(CardFooterInstanceActionButtons, () => {
    mockReactComponents([Toast, Button, MenuItem, Menu, MenuTrigger, MenuPopover, MenuList, Tooltip]);

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

        const renderResult = render(<CardFooterInstanceActionButtons {...defaultProps} />);
        // renderResult.debug()
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
            useOriginalReactElements('@fluentui/react-components', ['Tooltip', 'Menu', "MenuTrigger", "MenuButton", "MenuPopover", "MenuList", "MenuItem"])
            expect(renderedElement.asFragment()).toMatchSnapshot('component snapshot');
            if (isCardFooterCollapsed) {
                //expectMockedComponentPropsToMatchSnapshots([Button], 'action button menu props');
                expect(renderedElement.asFragment()).toMatchSnapshot('kebab button menu');
            }
        }
    });

    it.each(['test-kebabmenuarialabel', undefined])(
        'renders per snapshot with %s aria label passed as prop',
        ariaLabel => {
            useOriginalReactElements('@fluentui/react-components', ['Tooltip', 'Menu', 'MenuTrigger', 'MenuButton']);
            defaultProps.narrowModeStatus = { isCardFooterCollapsed: true } as NarrowModeStatus;

            const newProps = {
                ...defaultProps,
                kebabMenuAriaLabel: ariaLabel,
            };
            setupGetMenuItems(menuItems, newProps);

            const renderResult = render(<CardFooterInstanceActionButtons {...newProps} />);

            expect(renderResult.asFragment()).toMatchSnapshot('component snapshot');
            // expectMockedComponentPropsToMatchSnapshots([Button], 'action button menu props');
        },
    );

    it("onIssueFilingSettingsDialogDismissed focus kebab button", async () => {
        useOriginalReactElements('@fluentui/react-components', ['Tooltip', 'Menu', 'MenuTrigger', 'MenuButton']);
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

        // const buttonRef = jest.spyOn(React, 'useRef').mockReturnValue({ current: { focus: jest.fn() } })
        menuItemsProps.onIssueFilingSettingsDialogDismissed();
        const getButton = result.getByRole('button');
        // console.log('here-->', document.activeElement)
        // //expect(buttonRef).toHaveBeenCalled()
        expect(document.activeElement).toBe(getButton);
    })

    // it('onIssueFilingSettingsDialogDismissed focuses kebab button', async () => {
    //     useOriginalReactElements('@fluentui/react-components', ['Button', 'Tooltip'])
    //     defaultProps.narrowModeStatus = { isCardFooterCollapsed: false } as NarrowModeStatus;

    //     const kebabButtonMock = Mock.ofType<IButton>();
    //     let menuItemsProps: CardFooterMenuItemsProps;


    //     menuItemsBuilderMock
    //         .setup(m =>
    //             m.getCardFooterMenuItems(
    //                 It.isObjectWith(defaultProps as unknown as CardFooterMenuItemsProps),
    //             ),
    //         )
    //         .returns((props: CardFooterMenuItemsProps) => {
    //             menuItemsProps = props;
    //             return menuItems;
    //         });

    //     const result = render(<CardFooterInstanceActionButtons {...defaultProps} />);
    //     console.log('result.container[0]', result.container[0]);
    //     const fileIssueButtonRef = jest.spyOn(React, 'useRef')
    //     jest.spyOn(React, 'useRef').mockReturnValue({ current: { focus: jest.fn(), removeAttribute: jest.fn(), setAttribute: jest.fn() } })
    //     //const getButton = result.container[0];
    //     //console.log('here-->', getMockComponentClassPropsForCall(Button))
    //     // call ref callback to set rendered component's ref to our button mock
    //     // const kebabButtonRefCallback = getMockComponentClassPropsForCall(Button).ref as (
    //     //     ref: IButton,
    //     // ) => void;
    //     // kebabButtonRefCallback(kebabButtonMock.object);

    //     menuItemsProps.onIssueFilingSettingsDialogDismissed();
    //     expect(getButton).toHaveFocus();

    //     // kebabButtonMock.verify(k => k.focus(), Times.once());
    // });

    it('File issue button is focused when issue filing settings dialog is dismissed', async () => {
        useOriginalReactElements('@fluentui/react-components', ['Tooltip', 'Button']);
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: false } as NarrowModeStatus;
        //= jest.spyOn(React, 'useRef').mockReturnValue(())
        //  const fileIssueButtonMock = jest.spyOn(React, 'useRef').mockReturnValue({ current: { focus: jest.fn(), removeAttribute: jest.fn(), setAttribute: jest.fn() } })
        //const fileIssueButtonMock = React.useRef<HTMLInputElement>(null)
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

        const renderResult = render(
            <CardFooterInstanceActionButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );


        // call ref callback to set rendered component's ref to our button mock
        //const buttonRefCallback = menuItemsProps.fileIssueButtonRef as any;
        //buttonRefCallback(fileIssueButtonMock);
        //console.log('here-->', buttonRefCallback(fileIssueButtonMock))

        menuItemsProps.onIssueFilingSettingsDialogDismissed();
        renderResult.debug()
        // const getButton = screen.getByText('item 1', { selector: 'button' });
        const getButton = screen.getByText(/item 1/)

        //fileIssueButtonMock.verify(f => f.focus(), Times.once());
        expect(document.activeElement).toBe(getButton);
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
