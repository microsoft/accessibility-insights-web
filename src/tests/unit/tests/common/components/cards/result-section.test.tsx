// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ResultSection,
    ResultSectionDeps,
    ResultSectionProps,
} from 'common/components/cards/result-section';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ResultSection', () => {
    const getNextHeadingLevelStub = (headingLevel: HeadingLevel) => headingLevel + 1;
    describe('renders', () => {
        const shouldAlertValues = [false, true, undefined];

        it.each(shouldAlertValues)(
            'with shouldAlertFailureCount = <%s>',
            shouldAlertFailuresCount => {
                const props: ResultSectionProps = {
                    containerClassName: 'result-section-class-name',
                    deps: {
                        getNextHeadingLevel: getNextHeadingLevelStub,
                    } as ResultSectionDeps,
                    shouldAlertFailuresCount,
                    sectionHeadingLevel: 2,
                } as ResultSectionProps;

                const wrapper = shallow(<ResultSection {...props} />);
                expect(wrapper.getElement()).toMatchSnapshot();
            },
        );
    });
});
