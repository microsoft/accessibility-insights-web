// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RequirementViewTitle,
    RequirementViewTitleProps,
} from 'DetailsView/components/requirement-view-title';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RequirementViewTitleTest', () => {
    it('renders with content from props', () => {
        const props = {
            name: 'test-requirement-name',
        } as RequirementViewTitleProps;

        const rendered = shallow(<RequirementViewTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
