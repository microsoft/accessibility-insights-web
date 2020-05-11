// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    GettingStartedView,
    GettingStartedViewProps,
} from 'DetailsView/components/getting-started-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('GettingStartedViewTest', () => {
    it('renders with content from props', () => {
        const props: GettingStartedViewProps = {
            gettingStartedContent: <div>test-getting-started-content</div>,
        };

        const rendered = shallow(<GettingStartedView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
