// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create, GuidanceTitle } from '../../common';
import { howToTest } from './how-to-test';
import { whyItMatters } from './why-it-matters';

export const guidance = create(({ Markup }) => (
    <>
        <GuidanceTitle name={'Tab stops'} />
        <Markup.Include content={howToTest} />
        <Markup.Include content={whyItMatters} />
    </>
));
