// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    NullIssueFilingService,
    NullIssueFilingServiceSettings,
} from '../../../../../../issue-filing/services/null-issue-filing-service/null-issue-filing-service';
import { SettingsFormProps } from '../../../../../../issue-filing/types/settings-form-props';

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
        it.each(testSettings)('with %p', settings => {
            expect(NullIssueFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    it('renders settings form', () => {
        const Component = NullIssueFilingService.settingsForm;

        const props: SettingsFormProps<NullIssueFilingServiceSettings> = {
            deps: null,
            settings: null,
            onPropertyUpdateCallback: () => {},
        };

        const renderResult = render(<Component {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
