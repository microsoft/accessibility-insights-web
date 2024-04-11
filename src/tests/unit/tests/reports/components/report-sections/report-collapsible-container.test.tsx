// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { forOwn } from 'lodash';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { HeadingElementForLevel } from '../../../../../../common/components/heading-element-for-level';
import {
    ReportCollapsibleContainerControl,
    ReportCollapsibleContainerProps,
} from '../../../../../../reports/components/report-sections/report-collapsible-container';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/heading-element-for-level');
describe('ReportCollapsibleContainerControl', () => {
    mockReactComponents([HeadingElementForLevel]);
    let onExpandToggleMock: IMock<(event: React.MouseEvent<HTMLDivElement>) => void>;
    const optionalPropertiesObject = {
        contentClassName: [undefined, 'content-class-name-a'],
        containerClassName: [undefined, 'a-container'],
        buttonAriaLabel: [undefined, 'some button label'],
        id: [undefined, 'some id'],
    };
    onExpandToggleMock = Mock.ofType<(event: React.MouseEvent<HTMLDivElement>) => void>();
    forOwn(optionalPropertiesObject, (propertyValues, propertyName) => {
        propertyValues.forEach(value => {
            test(`render with ${propertyName} set to: ${value}`, () => {
                const props: ReportCollapsibleContainerProps = {
                    id: 'some-id',
                    header: <div>Some header</div>,
                    content: <div>Some content</div>,
                    headingLevel: 5,
                    [propertyName]: value,
                    onExpandToggle: onExpandToggleMock.object,
                };
                //console.log(props, "props");
                const control = ReportCollapsibleContainerControl(props);
                //console.log(control, "control");
                const renderResult = render(control);
                //console.log(renderResult, "renderResult");

                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});
