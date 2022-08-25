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
import {
    allCardInteractionsSupported,
    onlyUserConfigAgnosticCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { guidanceTags } from 'common/types/store-data/guidance-links';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { IssueFilingDialog } from 'DetailsView/components/issue-filing-dialog';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow, ShallowWrapper } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe(CardFooterInstanceActionButtons, () => {
    let defaultProps: CardFooterInstanceActionButtonsProps;
    let defaultDeps: CardFooterInstanceActionButtonsDeps;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let testIssueFilingServiceStub: IssueFilingService;
    let issueDetailsData: CreateIssueDetailsTextData;
    let menuItemsBuilderMock: IMock<CardFooterMenuItemsBuilder>;
    let cardsViewControllerMock: IMock<CardsViewController>;
    let cardsViewStoreData: CardsViewStoreData;
    const testKey: string = 'test';

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
        testIssueFilingServiceStub = {
            key: testKey,
            displayName: 'TEST',
            settingsForm: NamedFC('testForm', () => <>Hello World</>),
            isSettingsValid: () => true,
            buildStoreData: testField => {
                return { testField };
            },
            getSettingsFromStoreData: data => data[testKey],
            fileIssue: () => Promise.resolve(),
        };

        issueDetailsData = {
            rule: {
                id: 'id',
                description: 'description',
                url: 'url',
                guidance: [
                    {
                        href: 'www.test.com',
                        text: 'text',
                        tags: [guidanceTags.WCAG_2_1],
                    },
                ],
            },
            targetApp: {
                name: 'name',
                url: 'url',
            },
            element: {
                identifier: 'identifier',
                conciseName: 'conciseName',
            },
            howToFixSummary: 'howToFixSummary',
            snippet: 'snippet',
        };
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        menuItemsBuilderMock = Mock.ofType<CardFooterMenuItemsBuilder>();
        cardsViewControllerMock = Mock.ofType<CardsViewController>();

        userConfigurationStoreData = {
            bugService: testKey,
            bugServicePropertiesMap: {
                [testKey]: {},
            },
            enableHighContrast: false,
            lastSelectedHighContrast: false,
            enableTelemetry: true,
            isFirstTime: true,
            adbLocation: null,
            lastWindowState: null,
            lastWindowBounds: null,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
        };

        cardsViewStoreData = {
            isIssueFilingSettingsDialogOpen: false,
        };

        issueFilingServiceProviderMock
            .setup(bp => bp.forKey('test'))
            .returns(() => testIssueFilingServiceStub);

        defaultDeps = {
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            cardInteractionSupport: allCardInteractionsSupported,
            cardFooterMenuItemsBuilder: menuItemsBuilderMock.object,
            cardsViewController: cardsViewControllerMock.object,
        } as CardFooterInstanceActionButtonsDeps;

        defaultProps = {
            deps: defaultDeps,
            userConfigurationStoreData,
            issueDetailsData,
            cardsViewStoreData: cardsViewStoreData,
        } as CardFooterInstanceActionButtonsProps;
    });

    afterEach(() => {
        issueFilingServiceProviderMock.verifyAll();
    });

    it('renders as null with no menu items', () => {
        setupGetMenuItems([], defaultProps);

        const rendered = shallow(<CardFooterInstanceActionButtons {...defaultProps} />);

        expect(rendered.getElement()).toBeNull();
    });

    describe.each([true, false])('with isCardFooterCollapsed=%s', isCardFooterCollapsed => {
        beforeEach(() => {
            defaultProps.narrowModeStatus = { isCardFooterCollapsed } as NarrowModeStatus;
        });

        it('renders per snapshot with allCardInteractionsSupported', () => {
            setupGetMenuItems(menuItems, defaultProps);

            const rendered = shallow(<CardFooterInstanceActionButtons {...defaultProps} />);

            verifySnapshots(rendered);
        });

        it('renders per snapshot with onlyUserConfigAgnosticCardInteractionsSupported', () => {
            const newProps: CardFooterInstanceActionButtonsProps = {
                ...defaultProps,
                deps: {
                    ...defaultDeps,
                    cardInteractionSupport: onlyUserConfigAgnosticCardInteractionsSupported,
                },
            };

            setupGetMenuItems(menuItems, newProps);

            const rendered = shallow(<CardFooterInstanceActionButtons {...newProps} />);

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
        'renders per snapshot with allCardInteractionsSupported and %s aria label passed as prop',
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

    it('kebab button is focused when issue filing settings dialog is dismissed', async () => {
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: true } as NarrowModeStatus;

        const kebabButtonMock = Mock.ofType<IButton>();

        setupGetMenuItems(menuItems, defaultProps);

        const rendered = shallow(
            <CardFooterInstanceActionButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );
        const kebabButtonRefCallback = rendered.find(ActionButton).prop('componentRef') as (
            ref: IButton,
        ) => void;

        kebabButtonRefCallback(kebabButtonMock.object);

        const issueFilingDialog = rendered.find(IssueFilingDialog);
        const afterDialogDismissed = issueFilingDialog.prop('afterClosed');

        afterDialogDismissed();

        kebabButtonMock.verify(k => k.focus(), Times.once());
    });

    it('File issue button is focused when issue filing settings dialog is dismissed', async () => {
        defaultProps.narrowModeStatus = { isCardFooterCollapsed: false } as NarrowModeStatus;

        const fileIssueButtonMock = Mock.ofType<IButton>();

        let fileIssueButtonRefCallback: any;
        menuItemsBuilderMock
            .setup(m =>
                m.getCardFooterMenuItems(
                    It.isObjectWith(defaultProps as unknown as CardFooterMenuItemsProps),
                ),
            )
            .returns(props => {
                fileIssueButtonRefCallback = props.fileIssueButtonRef;
                return menuItems;
            });

        const rendered = shallow(
            <CardFooterInstanceActionButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );

        fileIssueButtonRefCallback(fileIssueButtonMock.object);

        const issueFilingDialog = rendered.find(IssueFilingDialog);
        const afterDialogDismissed = issueFilingDialog.prop('afterClosed');

        afterDialogDismissed();

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
