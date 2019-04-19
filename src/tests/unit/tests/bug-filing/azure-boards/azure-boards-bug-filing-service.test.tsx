// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AzureBoardsBugFilingService,
    AzureBoardsBugFilingSettings,
    AzureBoardsIssueDetailField,
} from '../../../../../bug-filing/azure-boards/azure-boards-bug-filing-service';
import { AzureBoardsSettingsForm } from '../../../../../bug-filing/azure-boards/azure-boards-settings-form';
import { azureBoardsIssueFilingUrlProvider } from '../../../../../bug-filing/azure-boards/create-azure-boards-issue-filing-url';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('AzureBoardsBugFilingServiceTest', () => {
    const projectUrlStub: string = 'some/project/url';
    const issueDetailsLocationStub: AzureBoardsIssueDetailField = 'some location' as AzureBoardsIssueDetailField;

    const invalidTestSettings: AzureBoardsBugFilingSettings[] = [
        null,
        {} as AzureBoardsBugFilingSettings,
        undefined,
        { projectURL: '' } as AzureBoardsBugFilingSettings,
        { projectURL: '', issueDetailsField: '' as AzureBoardsIssueDetailField },
        { projectURL: 'some project', issueDetailsField: '' as AzureBoardsIssueDetailField },
        { projectURL: '', issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField },
    ];

    it('static properties', () => {
        expect(AzureBoardsBugFilingService.key).toBe('azureBoards');
        expect(AzureBoardsBugFilingService.displayName).toBe('Azure Boards');
        expect(AzureBoardsBugFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureBoardsBugFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        expect(AzureBoardsBugFilingService.buildStoreData(projectUrlStub, issueDetailsLocationStub)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureBoardsBugFilingSettings = {
            projectURL: projectUrlStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        const givenData: BugServicePropertiesMap = {
            'some other service': {},
            [AzureBoardsBugFilingService.key]: expectedStoreData,
        };
        expect(AzureBoardsBugFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('isSettingsValid', () => {
        it.each(invalidTestSettings)('handles invalid settings: %o', settings => {
            expect(AzureBoardsBugFilingService.isSettingsValid(settings)).toBe(false);
        });

        it('handles valid settings', () => {
            const validSettings: AzureBoardsBugFilingSettings = {
                projectURL: projectUrlStub,
                issueDetailsField: 'some issue details location' as AzureBoardsIssueDetailField,
            };

            expect(AzureBoardsBugFilingService.isSettingsValid(validSettings)).toBe(true);
        });
    });

    it('has correct settingsForm', () => {
        expect(AzureBoardsBugFilingService.settingsForm).toBe(AzureBoardsSettingsForm);
    });

    it('has correct issue filing url property', () => {
        expect(AzureBoardsBugFilingService.issueFilingUrlProvider).toBe(azureBoardsIssueFilingUrlProvider);
    });
});
