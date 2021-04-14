// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { frameTitleInstanceDetailsColumnRenderer } from 'assessments/page/frametitle-instance-details-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import * as React from 'react';
import { FrameAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { FrameFormatter } from '../../../../injected/visualization/frame-formatter';

describe('FrameTitleInstanceDetailsColumnRendererTest', () => {
    test('render: propertyBag is null', () => {
        const frameType = 'default';
        const item = {
            instance: {
                propertyBag: null,
            },
        } as InstanceTableRow<FrameAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={FrameFormatter.frameStyles[frameType].borderColor}
                labelText={FrameFormatter.frameStyles[frameType].contentText}
                textContent={null}
            />
        );
        expect(expected).toEqual(frameTitleInstanceDetailsColumnRenderer(item));
    });

    test('render: normal *iframe* title', () => {
        const frameTitle = 'Test IFRAME title';
        const frameType = 'iframe';
        const item = {
            instance: {
                propertyBag: {
                    frameType: frameType,
                    frameTitle: frameTitle,
                },
            },
        } as InstanceTableRow<FrameAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={FrameFormatter.frameStyles[frameType].borderColor}
                labelText={FrameFormatter.frameStyles[frameType].contentText}
                textContent={frameTitle}
            />
        );
        expect(expected).toEqual(frameTitleInstanceDetailsColumnRenderer(item));
    });

    test('render: normal *frame* title', () => {
        const frameTitle = 'Test FRAME title';
        const frameType = 'frame';
        const item = {
            instance: {
                propertyBag: {
                    frameType: frameType,
                    frameTitle: frameTitle,
                },
            },
        } as InstanceTableRow<FrameAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={FrameFormatter.frameStyles[frameType].borderColor}
                labelText={FrameFormatter.frameStyles[frameType].contentText}
                textContent={frameTitle}
            />
        );
        expect(expected).toEqual(frameTitleInstanceDetailsColumnRenderer(item));
    });
});
