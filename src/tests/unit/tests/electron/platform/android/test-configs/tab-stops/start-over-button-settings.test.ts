// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { tabStopsStartOverButtonSettings } from 'electron/platform/android/test-configs/tab-stops/start-over-button-settings';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';
import { IMock, Mock } from 'typemoq';

describe('tabStopsStartOverButtonSettings', () => {
    let props: ReflowCommandBarProps;
    let tabStopsActionCreatorMock: IMock<TabStopsActionCreator>;

    beforeEach(() => {
        tabStopsActionCreatorMock = Mock.ofType(TabStopsActionCreator);

        props = {
            deps: {
                tabStopsActionCreator: tabStopsActionCreatorMock.object,
            },
        } as ReflowCommandBarProps;
    });

    it('Disabled is false', () => {
        expect(tabStopsStartOverButtonSettings(props).disabled).toBe(false);
    });

    it('clickHandler is correct', () => {
        expect(tabStopsStartOverButtonSettings(props).onClick).toEqual(
            tabStopsActionCreatorMock.object.startOver,
        );
    });
});
