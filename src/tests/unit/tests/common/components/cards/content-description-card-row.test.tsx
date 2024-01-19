// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ContentDescriptionCardRow } from 'common/components/cards/content-description-card-row';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import * as React from 'react';
import { SimpleCardRow } from '../../../../../../common/components/cards/simple-card-row';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/cards/simple-card-row');
describe('ContentDescriptionCardRow', () => {
    mockReactComponents([SimpleCardRow]);

    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'test content description',
            deps: {} as CardRowDeps,
            index: -1,
        };

        const renderResult = render(<ContentDescriptionCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
