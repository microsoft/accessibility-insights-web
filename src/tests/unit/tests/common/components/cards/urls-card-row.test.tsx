// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';
import { UrlsCardRow, UrlsCardRowProps } from 'common/components/cards/urls-card-row';

describe('UrlsCardRow', () => {
    it('renders', () => {
        const props: UrlsCardRowProps = {
            propertyData: ['https://www.test.com', 'https://www.test.com/more/tests'],
            deps: {} as CardRowDeps,
            index: -1,
        };
        const testSubject = shallow(<UrlsCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
