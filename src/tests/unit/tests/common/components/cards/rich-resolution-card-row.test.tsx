// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    RichResolutionCardRow,
    RichResolutionCardRowProps,
} from 'common/components/cards/rich-resolution-card-row';
import { RichResolutionContent } from 'common/components/cards/rich-resolution-content';
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/cards/rich-resolution-content');
jest.mock('common/components/cards/simple-card-row');

describe('RichResolutionCardRow', () => {
    mockReactComponents([RichResolutionContent, SimpleCardRow]);
    it.each(['check', 'fix'] as const)('renders with labelType=%s', labelType => {
        const props: RichResolutionCardRowProps = {
            deps: null,
            index: 123,
            propertyData: {
                labelType,
                contentId: 'content-id',
                contentVariables: { 'content-var-key': 'content-var-value' },
            },
        };

        const renderResult = render(<RichResolutionCardRow {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([SimpleCardRow, RichResolutionContent]);
    });
});
