// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { Mock } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { IssueFilingServiceProperties } from '../../../../../common/types/store-data/user-configuration-store';
import { IssueFilingChoiceGroup } from '../../../../../issue-filing/components/issue-filing-choice-group';
import {
    IssueFilingSettingsContainer,
    IssueFilingSettingsContainerDeps,
    IssueFilingSettingsContainerProps,
} from '../../../../../issue-filing/components/issue-filing-settings-container';
import { IssueFilingServiceProvider } from '../../../../../issue-filing/issue-filing-service-provider';
import { AzureBoardsSettingsForm } from '../../../../../issue-filing/services/azure-boards/azure-boards-settings-form';
import { IssueFilingService } from '../../../../../issue-filing/types/issue-filing-service';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('issue-filing/services/azure-boards/azure-boards-settings-form');
jest.mock('issue-filing/components/issue-filing-choice-group');
describe('IssueFilingSettingsContainerTest', () => {
    mockReactComponents([IssueFilingChoiceGroup, AzureBoardsSettingsForm]);
    const issueFilingServicesProviderMock = Mock.ofType(IssueFilingServiceProvider);
    const selectedIssueFilingService: IssueFilingService = {
        key: 'test',
        displayName: 'TEST',
        settingsForm: AzureBoardsSettingsForm,
    } as IssueFilingService;
    const issueFilingServices = [selectedIssueFilingService];
    const selectedIssueFilingServiceData: IssueFilingServiceProperties = {
        repository: 'none',
    };
    const userConfigMessageCreatorStub: UserConfigMessageCreator = {} as UserConfigMessageCreator;
    const props: IssueFilingSettingsContainerProps = {
        deps: {
            userConfigMessageCreator: userConfigMessageCreatorStub,
            issueFilingServiceProvider: issueFilingServicesProviderMock.object,
        } as IssueFilingSettingsContainerDeps,
        selectedIssueFilingService,
        selectedIssueFilingServiceData,
        onPropertyUpdateCallback: () => null,
        onSelectedServiceChange: () => null,
    };

    test('render', () => {
        issueFilingServicesProviderMock
            .setup(mock => mock.allVisible())
            .returns(() => issueFilingServices);
        const renderResult = render(<IssueFilingSettingsContainer {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([IssueFilingChoiceGroup]);
    });
});
