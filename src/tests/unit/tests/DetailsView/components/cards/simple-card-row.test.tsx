// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import { SimpleCardRow, SimpleCardRowProps } from '../../../../../../DetailsView/components/cards/simple-card-row';

describe('SimpleCardRow', () => {
    let label: string;
    let content: string | JSX.Element;
    let rowKey: string;
    let props: SimpleCardRowProps;

    beforeEach(() => {
        label = 'test label';
        content = 'test content';
        rowKey = 'test row key';
        props = {
            label,
            content,
            rowKey,
        };
    });

    it('renders', () => {
        const testSubject = shallow(<SimpleCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders with correct styling when extra class name is needed', () => {
        props.needsExtraClassname = true;
        const testSubject = shallow(<SimpleCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
