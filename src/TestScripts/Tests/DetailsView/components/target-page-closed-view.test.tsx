// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { TargetPageClosedView } from '../../../../DetailsView/components/target-page-closed-view';

describe('StaleView', () => {
    test('render stale view for default', () => {
        const staleView = new TargetPageClosedView(undefined);

        const expectedComponent = (
            <div className="target-page-closed">
                <h1>No content available</h1>
                <p>The target page was closed. You can close this tab or reuse it for something else.</p>
            </div>
        );

        expect(staleView.render()).toEqual(expectedComponent);
    });
});
