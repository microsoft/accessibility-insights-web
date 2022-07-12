// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, IContextualMenuItem } from '@fluentui/react';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import {
    CardFooterFarButtons,
    CardKebabMenuButtonDeps,
    CardFooterFarButtonsProps,
} from 'common/components/cards/card-footer-far-buttons';
import {
    allCardInteractionsSupported,
    noCardInteractionsSupported,
    onlyUserConfigAgnosticCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import { Toast } from 'common/components/toast';
import { guidanceTags } from 'common/guidance-links';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NavigatorUtils } from 'common/navigator-utils';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { WindowUtils } from 'common/window-utils';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, It, Mock, Times } from 'typemoq';

describe(CardFooterFarButtons, () => {
    let defaultProps: CardFooterFarButtonsProps;
    let defaultDeps: CardKebabMenuButtonDeps;
    let detailsViewActionCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;
    let windowUtilsMock: IMock<WindowUtils>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let issueFilingActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;
    let testIssueFilingServiceStub: IssueFilingService;
    let textGeneratorMock: IMock<IssueDetailsTextGenerator>;
    let issueDetailsData: CreateIssueDetailsTextData;
    const testKey: string = 'test';

    const event = {
        currentTarget: 'Card View',
    } as React.MouseEvent<any>;

    const issueDetailsText = 'placeholder text';

    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

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
        textGeneratorMock = Mock.ofType<IssueDetailsTextGenerator>();
        detailsViewActionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        navigatorUtilsMock = Mock.ofType<NavigatorUtils>();
        windowUtilsMock = Mock.ofType<WindowUtils>();
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        issueFilingActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);

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
        };

        issueFilingServiceProviderMock
            .setup(bp => bp.forKey('test'))
            .returns(() => testIssueFilingServiceStub);

        textGeneratorMock
            .setup(tg => tg.buildText(issueDetailsData, toolData))
            .returns(() => issueDetailsText);

        defaultDeps = {
            detailsViewActionMessageCreator: detailsViewActionCreatorMock.object,
            navigatorUtils: navigatorUtilsMock.object,
            windowUtils: windowUtilsMock.object,
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
            issueDetailsTextGenerator: textGeneratorMock.object,
            cardInteractionSupport: allCardInteractionsSupported,
            toolData,
        } as CardKebabMenuButtonDeps;

        defaultProps = {
            deps: defaultDeps,
            userConfigurationStoreData,
            issueDetailsData,
        } as CardFooterFarButtonsProps;
    });

    afterEach(() => {
        detailsViewActionCreatorMock.verifyAll();
        navigatorUtilsMock.verifyAll();
        textGeneratorMock.verifyAll();
        windowUtilsMock.verifyAll();
        issueFilingActionMessageCreatorMock.verifyAll();
        issueFilingServiceProviderMock.verifyAll();
    });

    it('renders as null with noCardInteractionsSupported', () => {
        const rendered = shallow(
            <CardFooterFarButtons
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: noCardInteractionsSupported }}
            />,
        );

        expect(rendered.getElement()).toBeNull();
    });

    describe.each([true, false])('with isCardFooterCollapsed=%s', isCardFooterCollapsed => {
        beforeEach(() => {
            defaultProps.narrowModeStatus = { isCardFooterCollapsed } as NarrowModeStatus;
        });

        it('renders per snapshot with allCardInteractionsSupported', () => {
            const rendered = shallow(
                <CardFooterFarButtons
                    {...defaultProps}
                    deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
                />,
            );

            verifySnapshots(rendered);
        });

        it.each(['test-kebabmenuarialabel', undefined])(
            'renders per snapshot with allCardInteractionsSupported and %s aria label passed as prop',
            ariaLabel => {
                const newProps = {
                    ...defaultProps,
                    kebabMenuAriaLabel: ariaLabel,
                };
                const rendered = shallow(
                    <CardFooterFarButtons
                        {...newProps}
                        deps={{
                            ...defaultDeps,
                            cardInteractionSupport: allCardInteractionsSupported,
                        }}
                    />,
                );

                verifySnapshots(rendered);
            },
        );

        it('renders per snapshot with onlyUserConfigAgnosticCardInteractionsSupported', () => {
            const rendered = shallow(
                <CardFooterFarButtons
                    {...defaultProps}
                    deps={{
                        ...defaultDeps,
                        cardInteractionSupport: onlyUserConfigAgnosticCardInteractionsSupported,
                    }}
                />,
            );

            verifySnapshots(rendered);
        });

        it('copies failure details and show the toast', async () => {
            detailsViewActionCreatorMock
                .setup(creator => creator.copyIssueDetailsClicked(It.isAny()))
                .verifiable(Times.once());

            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.resolve();
                })
                .verifiable(Times.once());

            const rendered = mount(<CardFooterFarButtons {...defaultProps} />);

            await simulateClickMenuItem(rendered, 'copyfailuredetails');

            const toast = rendered.find(Toast);

            expect(toast.state().toastVisible).toBe(true);
            expect(toast.state().content).toBe('Failure details copied.');
        });

        it('shows failure message if copy failed', async () => {
            detailsViewActionCreatorMock
                .setup(creator => creator.copyIssueDetailsClicked(It.isAny()))
                .verifiable(Times.once());

            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.reject();
                })
                .verifiable(Times.once());

            const rendered = mount(<CardFooterFarButtons {...defaultProps} />);

            await simulateClickMenuItem(rendered, 'copyfailuredetails');

            const toast = rendered.find(Toast);

            expect(toast.state().toastVisible).toBe(true);
            expect(toast.state().content).toBe('Failed to copy failure details. Please try again.');
        });

        it('should file issue, valid settings', async () => {
            issueFilingActionMessageCreatorMock
                .setup(creator =>
                    creator.fileIssue(It.isAny(), testKey, defaultProps.issueDetailsData, toolData),
                )
                .verifiable(Times.once());

            const rendered = shallow<CardFooterFarButtons>(
                <CardFooterFarButtons {...defaultProps} />,
            );

            if (isCardFooterCollapsed) {
                rendered.find(ActionButton).simulate('click', event);
                expect(rendered.state().showNeedsSettingsContent).toBe(false);
            }

            await simulateClickMenuItem(rendered, 'fileissue');

            expect(rendered.state().showNeedsSettingsContent).toBe(false);
        });

        it('should click file issue, invalid settings', async () => {
            testIssueFilingServiceStub.isSettingsValid = () => false;
            issueFilingActionMessageCreatorMock
                .setup(creator =>
                    creator.fileIssue(It.isAny(), testKey, defaultProps.issueDetailsData, toolData),
                )
                .verifiable(Times.never());

            const rendered = shallow<CardFooterFarButtons>(
                <CardFooterFarButtons {...defaultProps} />,
            );

            expect(rendered.state().showNeedsSettingsContent).toBe(false);

            if (isCardFooterCollapsed) {
                rendered.find(ActionButton).simulate('click', event);
                expect(rendered.state().showNeedsSettingsContent).toBe(false);
            }

            await simulateClickMenuItem(rendered, 'fileissue');

            expect(rendered.state().showNeedsSettingsContent).toBe(true);
        });

        function getMenuItemWithKey(
            rendered: ReactWrapper | ShallowWrapper,
            itemKey: string,
        ): IContextualMenuItem {
            return rendered
                .find(ActionButton)
                .prop('menuProps')
                .items.find(elem => elem.key === itemKey);
        }

        function verifySnapshots(renderedElement: ShallowWrapper, propertyMatchers?: string): void {
            expect(renderedElement.debug()).toMatchSnapshot('component snapshot');
            if (isCardFooterCollapsed) {
                expect(renderedElement.find(ActionButton).prop('menuProps')).toMatchSnapshot(
                    'action button menu props',
                );
            }
        }

        async function simulateClickMenuItem(
            renderedElement: ReactWrapper | ShallowWrapper,
            menuItemKey: 'fileissue' | 'copyfailuredetails',
        ): Promise<void> {
            if (isCardFooterCollapsed) {
                getMenuItemWithKey(renderedElement, menuItemKey).onClick(event);
            } else {
                let element = renderedElement.find(`.${menuItemKey}`);
                if (element.length > 1) {
                    element = element.find('button');
                }

                element.simulate('click');
            }
            await flushSettledPromises();
        }
    });
});
