// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    ResultSectionV2,
    ResultSectionV2Deps,
    ResultSectionV2Props,
} from '../../../../../../DetailsView/components/cards/result-section-v2';

describe('ResultSectionV2', () => {
    it('renders', () => {
        const props: ResultSectionV2Props = {
            containerClassName: 'result-section-class-name',
            deps: {} as ResultSectionV2Deps,
        } as ResultSectionV2Props;

        const wrapper = shallow(<ResultSectionV2 {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
