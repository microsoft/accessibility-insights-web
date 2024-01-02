// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { TextCardRow } from 'common/components/cards/text-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import * as React from 'react';

describe('TextCardRow', () => {
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
