// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { PathCardRow } from 'common/components/cards/path-card-row';
import * as React from 'react';
import { SimpleCardRow } from '../../../../../../common/components/cards/simple-card-row';
import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/cards/simple-card-row');
describe('PathCardRow', () => {
    mockReactComponents([SimpleCardRow]);

    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'some path',
            deps: {} as CardRowDeps,
            index: -1,
        };
        const renderResult = render(<PathCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
