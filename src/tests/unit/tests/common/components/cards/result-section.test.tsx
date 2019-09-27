// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSection, ResultSectionDeps, ResultSectionProps } from 'common/components/cards/result-section';
import { shallow } from 'enzyme';
import * as React from 'react';

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
