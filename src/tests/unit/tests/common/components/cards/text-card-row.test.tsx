// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import { TextCardRow } from 'common/components/cards/text-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/cards/simple-card-row');

describe('TextCardRow', () => {
    mockReactComponents([SimpleCardRow]);
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'test text',
            deps: {} as CardRowDeps,
            index: -1,
        };

        const renderResult = render(<TextCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
