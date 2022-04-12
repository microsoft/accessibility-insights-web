// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';
import { createHowToTest } from './how-to-test';
import { whyItMatters } from './why-it-matters';

export const guidance = create(({ Markup }) => (
    <>
        <GuidanceTitle name={'Tab stops'} />
        <Markup.Include content={createHowToTest(2)} />
        <Markup.Include content={whyItMatters} />
    </>
));
