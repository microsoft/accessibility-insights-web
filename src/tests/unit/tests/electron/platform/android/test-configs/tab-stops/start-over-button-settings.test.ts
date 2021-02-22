// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { tabStopsStartOverButtonSettings } from 'electron/platform/android/test-configs/tab-stops/start-over-button-settings';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';

describe('tabStopsStartOverButtonSettings', () => {
    let props: ReflowCommandBarProps;

    beforeEach(() => {
        props = {} as ReflowCommandBarProps;
    });

    it('Disabled is true', () => {
        expect(tabStopsStartOverButtonSettings(props).disabled).toBeTruthy();
    });

    it('clickHandler is stubbed out', () => {
        tabStopsStartOverButtonSettings(props).onClick();
    });
});
