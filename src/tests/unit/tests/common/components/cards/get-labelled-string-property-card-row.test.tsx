// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { GetLabelledStringPropertyCardRow } from 'common/components/cards/get-labelled-string-property-card-row';
import * as React from 'react';

import {
    CardRowDeps,
    CardRowProps,
} from '../../../../../../common/configs/unified-result-property-configurations';
import { SimpleCardRow } from '../../../../../../common/components/cards/simple-card-row';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/cards/simple-card-row');
describe('GetLabelledStringPropertyCardRow', () => {
    mockReactComponents([SimpleCardRow]);

    it('renders with appropriate label/propertyData without contentClassName', () => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData: 'some string as propertyData',
            index: 22,
        };
        const renderResult = render(<TestSubject {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with appropriate label/propertyData and contentClassName', () => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label', 'test class name');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData: 'some string as propertyData',
            index: 22,
        };
        const renderResult = render(<TestSubject {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    const falsyPropertyData = [undefined, null, ''];

    it.each(falsyPropertyData)('renders null when property data is <%s>', propertyData => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label', 'test class name');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData,
            index: 22,
        };
        const renderResult = render(<TestSubject {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
