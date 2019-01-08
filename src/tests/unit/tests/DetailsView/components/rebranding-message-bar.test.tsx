// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RebrandingMessageBar } from '../../../../../DetailsView/components/rebranding-message-bar';

describe('RebrandingMessageBar', () => {
    it('renders as expected', () => {
        const rendered = shallow(<RebrandingMessageBar />);
        expect(rendered.debug()).toMatchSnapshot();
    });
});
