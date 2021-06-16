// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingServicePropertiesMap } from '../../../../../../common/types/store-data/user-configuration-store';
import { getAzureBoardsIssueFilingService } from '../../../../../../issue-filing/services/azure-boards/azure-boards-issue-filing-service';
import {
    AzureBoardsIssueDetailField,
    AzureBoardsIssueFilingSettings,
} from '../../../../../../issue-filing/services/azure-boards/azure-boards-issue-filing-settings';
import { AzureBoardsSettingsForm } from '../../../../../../issue-filing/services/azure-boards/azure-boards-settings-form';

describe('AzureBoardsIssueFilingServiceTest', () => {
    const projectUrlStub: string = 'some/project/url';
    const issueDetailsLocationStub: AzureBoardsIssueDetailField =
        'some location' as AzureBoardsIssueDetailField;
    const azureBoardsIssueFilingService = getAzureBoardsIssueFilingService(null);

    it('static properties', () => {
        expect(azureBoardsIssueFilingService.key).toBe('azureBoards');
        expect(azureBoardsIssueFilingService.displayName).toBe('Azure Boards');
        expect(azureBoardsIssueFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureBoardsIssueFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        expect(
            azureBoardsIssueFilingService.buildStoreData(projectUrlStub, issueDetailsLocationStub),
        ).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureBoardsIssueFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        const givenData: IssueFilingServicePropertiesMap = {
            'some other service': {},
            [azureBoardsIssueFilingService.key]: expectedStoreData,
        };
        expect(azureBoardsIssueFilingService.getSettingsFromStoreData(givenData)).toEqual(
            expectedStoreData,
        );
    });

    describe('isSettingsValid', () => {
        const invalidTestSettings: AzureBoardsIssueFilingSettings[] = [
            null,
            {} as AzureBoardsIssueFilingSettings,
            undefined,
            { projectURL: '' } as AzureBoardsIssueFilingSettings,
            { projectURL: '', issueDetailsField: '' as AzureBoardsIssueDetailField },
            { projectURL: 'some project', issueDetailsField: '' as AzureBoardsIssueDetailField },
            {
                projectURL: '',
                issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField,
            },
        ];

        it.each(invalidTestSettings)('handles invalid settings: %p', settings => {
            expect(azureBoardsIssueFilingService.isSettingsValid(settings)).toBe(false);
        });

        it('handles valid settings', () => {
            const validSettings: AzureBoardsIssueFilingSettings = {
                projectURL: projectUrlStub,
                issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField,
            };

            expect(azureBoardsIssueFilingService.isSettingsValid(validSettings)).toBe(true);
        });
    });

    it('has correct settingsForm', () => {
        expect(azureBoardsIssueFilingService.settingsForm).toBe(AzureBoardsSettingsForm);
    });
});
