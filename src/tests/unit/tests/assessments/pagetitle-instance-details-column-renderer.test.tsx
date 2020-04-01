// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { pageTitleInstanceDetailsColumnRenderer } from 'assessments/page/pagetitle-instance-details-column-renderer';
import { HeadingsAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from '../../../../DetailsView/components/assessment-instance-table';

describe('PageTitleInstanceDetailsColumnRendererTest', () => {
    test('render: propertyBag is null', () => {
        const item = {
            instance: {
                propertyBag: null,
            },
        } as AssessmentInstanceRowData<HeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={null}
                textContent={null}
                tooltipId={null}
            />
        );
        expect(expected).toEqual(pageTitleInstanceDetailsColumnRenderer(item));
    });

    test('render', () => {
        const pageTitle = 'Test Page Title';
        const item = {
            instance: {
                propertyBag: {
                    pageTitle: pageTitle,
                },
            },
        } as AssessmentInstanceRowData<any>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={null}
                textContent={pageTitle}
                tooltipId={null}
            />
        );
        expect(expected).toEqual(pageTitleInstanceDetailsColumnRenderer(item));
    });
});
