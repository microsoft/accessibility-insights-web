// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';
import { StringPropertyCardRowProps } from '../../../../../../DetailsView/components/cards/get-labelled-string-property-card-row';
import { SnippetCardRow } from '../../../../../../DetailsView/components/cards/snippet-card-row';

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
