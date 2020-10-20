// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import {
    UrlsCardRow,
    UrlsCardRowDeps,
    UrlsCardRowProps,
} from 'common/components/cards/urls-card-row';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';

describe('UrlsCardRow', () => {
    it('renders', () => {
        const props: UrlsCardRowProps = {
            propertyData: ['https://www.test.com', 'https://www.test.com/more/tests'],
            deps: {
                LinkComponent: NewTabLinkWithConfirmationDialog,
            } as UrlsCardRowDeps,
            index: -1,
        };
        const testSubject = shallow(<UrlsCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
