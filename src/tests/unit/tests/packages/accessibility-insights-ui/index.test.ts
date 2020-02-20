// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as index from 'packages/accessibility-insights-ui/index';
import { UIFactory } from 'packages/accessibility-insights-ui/ui-factory';

describe('index', () => {
    it('exports UIFactory', () => {
        expect(index.UIFactory).toBe(UIFactory);
    });
});
