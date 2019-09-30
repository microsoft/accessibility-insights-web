// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { SnippetCardRow } from 'common/components/cards/snippet-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';

describe('SnippetCardRow', () => {
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'some snippet',
            deps: {} as CardRowDeps,
            index: -1,
        };
        const testSubject = shallow(<SnippetCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
