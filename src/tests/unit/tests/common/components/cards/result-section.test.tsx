// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    ResultSection,
    ResultSectionDeps,
    ResultSectionProps,
} from 'common/components/cards/result-section';
import { ResultSectionContent } from 'common/components/cards/result-section-content';
import { HeadingLevel, HeadingElementForLevel } from 'common/components/heading-element-for-level';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
jest.mock('common/components/cards/result-section-content');
jest.mock('reports/components/outcome-chip');
jest.mock('common/components/heading-element-for-level');

describe('ResultSection', () => {
    mockReactComponents([ResultSectionContent, OutcomeChip, HeadingElementForLevel]);
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

                const renderResult = render(<ResultSection {...props} />);
                expect(renderResult.asFragment()).toMatchSnapshot();
                expectMockedComponentPropsToMatchSnapshots([ResultSectionContent]);
            },
        );
    });
});
