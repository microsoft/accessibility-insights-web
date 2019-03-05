// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';
import { whyItMatters } from './why-it-matters';

export const extraGuidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Tab stops'} />
        <Markup.Include content={whyItMatters} />
    </>
));
