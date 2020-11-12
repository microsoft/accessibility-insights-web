// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RichResolutionCardRow,
    RichResolutionCardRowProps,
} from 'common/components/cards/rich-resolution-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RichResolutionCardRow', () => {
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

        const testSubject = shallow(<RichResolutionCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
