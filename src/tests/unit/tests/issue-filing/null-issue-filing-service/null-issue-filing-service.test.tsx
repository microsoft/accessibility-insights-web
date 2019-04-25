// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import {
    NullIssueFilingService,
    NullIssueFilingServiceSettings,
} from '../../../../../issue-filing/null-issue-filing-service/null-issue-filing-service';
import { SettingsFormProps } from '../../../../../issue-filing/types/settings-form-props';

describe('NullIssueFilingService', () => {
    const testSettings = [null, {}, undefined, { repository: 'test-repository' }];

    it('has correct static properties', () => {
        expect(NullIssueFilingService.key).toBe('none');
        expect(NullIssueFilingService.displayName).toBe('None');
        expect(NullIssueFilingService.isHidden).toBe(true);
    });

    it('build store data', () => {
        expect(NullIssueFilingService.buildStoreData()).toBeNull();
    });

    it('getSettingsFromStoreData', () => {
        expect(NullIssueFilingService.getSettingsFromStoreData(null)).toBeNull();
    });

    describe('check settings', () => {
        it.each(testSettings)('with %o', settings => {
            expect(NullIssueFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    describe('creates bug filing url', () => {
        it.each(testSettings)('with %o', settings => {
            const issuesData: CreateIssueDetailsTextData = {
                pageTitle: 'test page title',
                pageUrl: '//test-page-url',
                ruleResult: {} as DecoratedAxeNodeResult,
            };
            expect(NullIssueFilingService.issueFilingUrlProvider(settings, issuesData, null)).toBeNull();
        });
    });

    it('renders settings form', () => {
        const Component = NullIssueFilingService.settingsForm;

        const props: SettingsFormProps<NullIssueFilingServiceSettings> = {
            deps: null,
            settings: null,
            onPropertyUpdateCallback: () => {},
        };

        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
