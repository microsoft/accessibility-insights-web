// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ClassNameCardRow } from 'common/components/cards/class-name-card-row';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import * as React from 'react';

describe('ClassNameCardRow', () => {
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'test class name',
            deps: {} as CardRowDeps,
            index: -1,
        };

        const renderResult = render(<ClassNameCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
