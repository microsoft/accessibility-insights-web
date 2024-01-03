// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import { SnippetCardRow } from 'common/components/cards/snippet-card-row';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';

jest.mock('common/components/cards/simple-card-row');
describe('SnippetCardRow', () => {
    mockReactComponents([SimpleCardRow]);
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'some snippet',
            deps: {} as CardRowDeps,
            index: -1,
        };
        const renderResult = render(<SnippetCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([SimpleCardRow]);
    });
});
