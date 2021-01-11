// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Captchas } from './test-steps/captchas';
import { ImageFunction } from './test-steps/image-function';
import { ImagesOfText } from './test-steps/images-of-text';
import { TextAlternative } from './test-steps/text-alternative';

const key = 'images';
const title = 'Images';
const { guidance } = content.images;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        Screen reader software cannot interpret images. The software will, however, read text that
        has been associated with images. The interpretation (meaning) of an image must be conveyed
        textually in the HTML (via the alt attribute associated with each img element).
    </React.Fragment>
);

export const ImagesAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    visualizationType: VisualizationType.ImagesAssessment,
    title,
    gettingStarted,
    guidance,
    requirements: [ImageFunction, TextAlternative, ImagesOfText, Captchas],
    storeDataKey: 'imageAssessment',
});
