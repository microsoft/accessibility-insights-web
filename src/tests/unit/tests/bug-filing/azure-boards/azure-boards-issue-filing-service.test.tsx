// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AzureBoardsIssueFilingService,
    AzureBoardsIssueFilingSettings,
    AzureBoardsIssueDetailField,
} from '../../../../../issue-filing/azure-boards/azure-boards-issue-filing-service';
import { AzureBoardsSettingsForm } from '../../../../../issue-filing/azure-boards/azure-boards-settings-form';
import { azureBoardsIssueFilingUrlProvider } from '../../../../../issue-filing/azure-boards/create-azure-boards-issue-filing-url';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('AzureBoardsIssueFilingServiceTest', () => {
    const projectUrlStub: string = 'some/project/url';
    const issueDetailsLocationStub: AzureBoardsIssueDetailField = 'some location' as AzureBoardsIssueDetailField;

    const invalidTestSettings: AzureBoardsIssueFilingSettings[] = [
        null,
        {} as AzureBoardsIssueFilingSettings,
        undefined,
        { projectURL: '' } as AzureBoardsIssueFilingSettings,
        { projectURL: '', issueDetailsField: '' as AzureBoardsIssueDetailField },
        { projectURL: 'some project', issueDetailsField: '' as AzureBoardsIssueDetailField },
        { projectURL: '', issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField },
    ];

    it('static properties', () => {
        expect(AzureBoardsIssueFilingService.key).toBe('azureBoards');
        expect(AzureBoardsIssueFilingService.displayName).toBe('Azure Boards');
        expect(AzureBoardsIssueFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureBoardsIssueFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        expect(AzureBoardsIssueFilingService.buildStoreData(projectUrlStub, issueDetailsLocationStub)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureBoardsIssueFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        const givenData: BugServicePropertiesMap = {
            'some other service': {},
            [AzureBoardsIssueFilingService.key]: expectedStoreData,
        };
        expect(AzureBoardsIssueFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('isSettingsValid', () => {
        it.each(invalidTestSettings)('handles invalid settings: %o', settings => {
            expect(AzureBoardsIssueFilingService.isSettingsValid(settings)).toBe(false);
        });

        it('handles valid settings', () => {
            const validSettings: AzureBoardsIssueFilingSettings = {
                projectURL: projectUrlStub,
                issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField,
            };

            expect(AzureBoardsIssueFilingService.isSettingsValid(validSettings)).toBe(true);
        });
    });

    it('has correct settingsForm', () => {
        expect(AzureBoardsIssueFilingService.settingsForm).toBe(AzureBoardsSettingsForm);
    });

    it('has correct issue filing url property', () => {
        expect(AzureBoardsIssueFilingService.issueFilingUrlProvider).toBe(azureBoardsIssueFilingUrlProvider);
    });
});
