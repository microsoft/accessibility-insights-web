// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ResultSection, ResultSectionDeps, ResultSectionProps } from '../../../../../../DetailsView/components/cards/result-section';

describe('ResultSection', () => {
    it('renders', () => {
        const props: ResultSectionProps = {
            containerClassName: 'result-section-class-name',
            deps: {} as ResultSectionDeps,
        } as ResultSectionProps;

        const wrapper = shallow(<ResultSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
