// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import { UrlsCardRow, UrlsCardRowProps } from 'common/components/cards/urls-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { expectMockedComponentPropsToMatchSnapshots, mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/cards/simple-card-row');

describe('UrlsCardRow', () => {
    mockReactComponents([SimpleCardRow]);
    it('renders with string-only URLs', () => {
        const props: UrlsCardRowProps = {
            propertyData: {
                urlInfos: [
                    { url: 'https://www.test.com', baselineStatus: 'unknown' },
                    { url: 'https://www.test.com/more/tests', baselineStatus: 'unknown' },
                ],
            },
            deps: {
                LinkComponent: NewTabLinkWithConfirmationDialog,
            } as CardRowDeps,
            index: -1,
        };
        const renderResult = render(<UrlsCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with baseline-aware URLs', () => {
        const props: UrlsCardRowProps = {
            propertyData: {
                urlInfos: [
                    { url: 'https://www.test.com', baselineStatus: 'unknown' },
                    { url: 'https://www.test.com/more/tests', baselineStatus: 'existing' },
                    { url: 'https://www.test.com/still/more/tests', baselineStatus: 'new' },
                ],
            },
            deps: {
                LinkComponent: NewTabLinkWithConfirmationDialog,
            } as CardRowDeps,
            index: -1,
        };
        const renderResult = render(<UrlsCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([SimpleCardRow]);
    });
});
