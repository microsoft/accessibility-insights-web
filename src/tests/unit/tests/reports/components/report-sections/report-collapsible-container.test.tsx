// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { forOwn } from 'lodash';
import * as React from 'react';

import { HeadingElementForLevel } from '../../../../../../common/components/heading-element-for-level';
import {
    ReportCollapsibleContainerControl,
    ReportCollapsibleContainerProps,
} from '../../../../../../reports/components/report-sections/report-collapsible-container';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/heading-element-for-level');
describe('ReportCollapsibleContainerControl', () => {
    mockReactComponents([HeadingElementForLevel]);
    const optionalPropertiesObject = {
        contentClassName: [undefined, 'content-class-name-a'],
        containerClassName: [undefined, 'a-container'],
        buttonAriaLabel: [undefined, 'some button label'],
        id: [undefined, 'some id'],
    };

    forOwn(optionalPropertiesObject, (propertyValues, propertyName) => {
        propertyValues.forEach(value => {
            test(`render with ${propertyName} set to: ${value}`, () => {
                const props: ReportCollapsibleContainerProps = {
                    id: 'some-id',
                    header: <div>Some header</div>,
                    content: <div>Some content</div>,
                    headingLevel: 5,
                    [propertyName]: value,
                };
                const control = ReportCollapsibleContainerControl(props);
                const renderResult = render(control);

                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});
