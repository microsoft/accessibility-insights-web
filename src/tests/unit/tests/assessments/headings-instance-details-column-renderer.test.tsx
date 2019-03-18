// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { headingsAssessmentInstanceDetailsColumnRenderer } from '../../../../assessments/headings/headings-instance-details-column-renderer';
import { IHeadingsAssessmentProperties } from '../../../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from '../../../../DetailsView/components/assessment-instance-table';
import { HeadingFormatter } from '../../../../injected/visualization/heading-formatter';

describe('HeadingsInstanceDetailsColumnRendererTest', () => {
    test('render: propertyBag is null', () => {
        const item = {
            instance: {
                propertyBag: null,
            },
        } as AssessmentInstanceRowData<IHeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={'#767676'}
                labelText={'N/A'}
                textContent={null}
                tooltipId={null}
                customClassName="not-applicable"
            />
        );
        expect(expected).toEqual(headingsAssessmentInstanceDetailsColumnRenderer(item));
    });

    test('render', () => {
        const item = {
            instance: {
                propertyBag: {
                    headingText: 'heading',
                    headingLevel: '3',
                },
            },
        } as AssessmentInstanceRowData<IHeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={HeadingFormatter.headingStyles['3'].borderColor}
                labelText={'H3'}
                textContent={'heading'}
                tooltipId={null}
                customClassName={null}
            />
        );
        expect(expected).toEqual(headingsAssessmentInstanceDetailsColumnRenderer(item));
    });
});
