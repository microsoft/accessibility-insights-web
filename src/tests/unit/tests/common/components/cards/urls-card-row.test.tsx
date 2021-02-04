// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UrlsCardRow, UrlsCardRowProps } from 'common/components/cards/urls-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import { shallow } from 'enzyme';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';

describe('UrlsCardRow', () => {
    it('renders', () => {
        const props: UrlsCardRowProps = {
            propertyData: { urls: ['https://www.test.com', 'https://www.test.com/more/tests'] },
            deps: {
                LinkComponent: NewTabLinkWithConfirmationDialog,
            } as CardRowDeps,
            index: -1,
        };
        const testSubject = shallow(<UrlsCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
