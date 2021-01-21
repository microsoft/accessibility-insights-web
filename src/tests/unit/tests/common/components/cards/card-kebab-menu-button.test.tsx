// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import {
    allCardInteractionsSupported,
    noCardInteractionsSupported,
    onlyUserConfigAgnosticCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import {
    CardKebabMenuButton,
    CardKebabMenuButtonDeps,
    CardKebabMenuButtonProps,
} from 'common/components/cards/card-kebab-menu-button';
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
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import { ActionButton, IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('CardKebabMenuButtonTest', () => {
    let defaultProps: CardKebabMenuButtonProps;
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
        };

        issueFilingServiceProviderMock
            .setup(bp => bp.forKey('test'))
            .returns(() => testIssueFilingServiceStub)
            .verifiable(Times.exactly(3));

        textGeneratorMock
            .setup(tg => tg.buildText(issueDetailsData, toolData))
            .returns(() => issueDetailsText)
            .verifiable();

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
        } as CardKebabMenuButtonProps;
    });

    it('renders as null with noCardInteractionsSupported', () => {
        const rendered = shallow(
            <CardKebabMenuButton
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: noCardInteractionsSupported }}
            />,
        );

        expect(rendered.getElement()).toBeNull();
    });

    it('renders per snapshot with allCardInteractionsSupported', () => {
        const rendered = shallow(
            <CardKebabMenuButton
                {...defaultProps}
                deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
            />,
        );

        expect(rendered.debug()).toMatchSnapshot();
        expect(rendered.find(ActionButton).prop('menuProps')).toMatchSnapshot();
    });

    it.each(['test-kebabmenuarialabel', undefined])(
        'renders per snapshot with allCardInteractionsSupported and %s aria label passed as prop',
        ariaLabel => {
            const newProps = {
                ...defaultProps,
                kebabMenuAriaLabel: ariaLabel,
            };
            const rendered = shallow(
                <CardKebabMenuButton
                    {...newProps}
                    deps={{ ...defaultDeps, cardInteractionSupport: allCardInteractionsSupported }}
                />,
            );

            expect(rendered.debug()).toMatchSnapshot('component-snapshot');
            expect(rendered.find(ActionButton).prop('menuProps')).toMatchSnapshot(
                'action button menu props',
            );
        },
    );

    it('renders per snapshot with onlyUserConfigAgnosticCardInteractionsSupported', () => {
        const rendered = shallow(
            <CardKebabMenuButton
                {...defaultProps}
                deps={{
                    ...defaultDeps,
                    cardInteractionSupport: onlyUserConfigAgnosticCardInteractionsSupported,
                }}
            />,
        );

        expect(rendered.debug()).toMatchSnapshot();
        expect(rendered.find(ActionButton).prop('menuProps')).toMatchSnapshot();
    });

    it('copies failure details and show the toast', async () => {
        detailsViewActionCreatorMock
            .setup(creator => creator.copyIssueDetailsClicked(event))
            .verifiable(Times.once());

        navigatorUtilsMock
            .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
            .returns(() => {
                return Promise.resolve();
            })
            .verifiable(Times.once());

        const rendered = mount(<CardKebabMenuButton {...defaultProps} />);

        rendered.find(ActionButton).simulate('click', event);

        const copyFailureDetailsMenuItem = getMenuItemWithKey(rendered, 'copyfailuredetails');

        // tslint:disable-next-line: await-promise
        await copyFailureDetailsMenuItem.onClick(event);

        const toast = rendered.find(Toast);

        expect(toast.state().toastVisible).toBe(true);
        expect(toast.state().content).toBe('Failure details copied.');

        verifyMocks([
            detailsViewActionCreatorMock,
            navigatorUtilsMock,
            textGeneratorMock,
            windowUtilsMock,
        ]);
    });

    it('shows failure message if copy failed', async () => {
        detailsViewActionCreatorMock
            .setup(creator => creator.copyIssueDetailsClicked(event))
            .verifiable(Times.once());

        navigatorUtilsMock
            .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
            .returns(() => {
                return Promise.reject();
            })
            .verifiable(Times.once());

        const rendered = mount(<CardKebabMenuButton {...defaultProps} />);

        rendered.find(ActionButton).simulate('click', event);

        const copyFailureDetailsMenuItem = getMenuItemWithKey(rendered, 'copyfailuredetails');
        // tslint:disable-next-line: await-promise
        await copyFailureDetailsMenuItem.onClick(event);

        const toast = rendered.find(Toast);

        expect(toast.state().toastVisible).toBe(true);
        expect(toast.state().content).toBe('Failed to copy failure details. Please try again.');

        verifyMocks([
            detailsViewActionCreatorMock,
            navigatorUtilsMock,
            textGeneratorMock,
            windowUtilsMock,
        ]);
    });

    it('should file issue, valid settings', async () => {
        issueFilingActionMessageCreatorMock
            .setup(creator =>
                creator.fileIssue(event, testKey, defaultProps.issueDetailsData, toolData),
            )
            .verifiable(Times.once());

        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

        rendered.find(ActionButton).simulate('click', event);

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        getMenuItemWithKey(rendered, 'fileissue').onClick(event);

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        verifyMocks([issueFilingActionMessageCreatorMock, issueFilingServiceProviderMock]);
    });

    it('should click file issue, invalid settings', () => {
        testIssueFilingServiceStub.isSettingsValid = () => false;
        issueFilingActionMessageCreatorMock
            .setup(creator =>
                creator.fileIssue(event, testKey, defaultProps.issueDetailsData, toolData),
            )
            .verifiable(Times.never());

        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        rendered.find(ActionButton).simulate('click', event);

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        getMenuItemWithKey(rendered, 'fileissue').onClick(event);

        expect(rendered.state().showNeedsSettingsContent).toBe(true);

        verifyMocks([issueFilingActionMessageCreatorMock, issueFilingServiceProviderMock]);
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

    function verifyMocks(mocks: IMock<any>[]): void {
        mocks.forEach(mock => mock.verifyAll());
    }
});
