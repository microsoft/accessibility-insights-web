// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { guidanceTags } from 'content/guidance-tags';
import { shallow } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import { ActionButton, ContextualMenu } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { CardKebabMenuButton, CardKebabMenuButtonProps } from '../../../../../../common/components/cards/card-kebab-menu-button';
import { NavigatorUtils } from '../../../../../../common/navigator-utils';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';

describe('CardKebabMenuButtonTest', () => {
    let defaultProps: CardKebabMenuButtonProps;
    let actionCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let issueFilingActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;
    let testIssueFilingServiceStub: IssueFilingService;
    const testKey: string = 'test';

    const event = {
        currentTarget: 'Card View',
    } as React.MouseEvent<any>;

    const issueDetailsText = 'The quick brown fox jumps over the lazy dog';

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
            fileIssue: () => {},
        };
        actionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        navigatorUtilsMock = Mock.ofType<NavigatorUtils>();
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        issueFilingActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);

        userConfigurationStoreData = {
            bugService: testKey,
            bugServicePropertiesMap: {
                [testKey]: {},
            },
            enableHighContrast: false,
            enableTelemetry: true,
            isFirstTime: true,
        };

        issueFilingServiceProviderMock
            .setup(bp => bp.forKey('test'))
            .returns(() => testIssueFilingServiceStub)
            .verifiable();

        defaultProps = {
            deps: {
                detailsViewActionMessageCreator: actionCreatorMock.object,
                navigatorUtils: navigatorUtilsMock.object,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
                issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
            },
            userConfigurationStoreData,
            issueDetailsData: {
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
            },
        } as CardKebabMenuButtonProps;
    });

    it('render', () => {
        const rendered = shallow(<CardKebabMenuButton {...defaultProps} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render ContextualMenu', () => {
        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        expect(rendered.debug()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    it('should click copy failure details and show the toast', async () => {
        actionCreatorMock.setup(creator => creator.copyIssueDetailsClicked(event)).verifiable(Times.once());
        const copyToClipboardPromise = Promise.resolve();

        navigatorUtilsMock
            .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
            .returns(async () => copyToClipboardPromise)
            .verifiable(Times.once());

        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

        rendered.find(ActionButton).simulate('click', event);

        expect(rendered.state().showingCopyToast).toBe(false);

        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'copyfailuredetails')
            .onClick(event);

        await copyToClipboardPromise;

        expect(rendered.debug()).toMatchSnapshot();

        expect(rendered.state().showingCopyToast).toBe(true);

        actionCreatorMock.verifyAll();
        navigatorUtilsMock.verifyAll();
    });

    it('should click file issue, valid settings', () => {
        issueFilingActionMessageCreatorMock
            .setup(creator => creator.fileIssue(event, testKey, defaultProps.issueDetailsData))
            .verifiable(Times.once());

        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

        rendered.find(ActionButton).simulate('click', event);

        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'fileissue')
            .onClick(event);

        expect(rendered.debug()).toMatchSnapshot();

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        issueFilingActionMessageCreatorMock.verifyAll();
    });

    it('should click file issue, invalid settings', () => {
        testIssueFilingServiceStub.isSettingsValid = () => false;
        issueFilingActionMessageCreatorMock
            .setup(creator => creator.fileIssue(event, testKey, defaultProps.issueDetailsData))
            .verifiable(Times.never());

        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

        expect(rendered.state().showNeedsSettingsContent).toBe(false);

        rendered.find(ActionButton).simulate('click', event);

        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'fileissue')
            .onClick(event);

        expect(rendered.debug()).toMatchSnapshot();

        issueFilingActionMessageCreatorMock.verifyAll();
        expect(rendered.state().showNeedsSettingsContent).toBe(true);
    });

    it('should dismiss the contextMenu', () => {
        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().showingCopyToast).toBe(false);
        expect(rendered.state().showNeedsSettingsContent).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
