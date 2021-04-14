// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as commonStyles from 'electron/views/screenshot/common-visual-helper-section-styles.scss';
import {
    VirtualKeyboardButtons,
    VirtualKeyboardButtonsDeps,
} from 'electron/views/tab-stops/virtual-keyboard-buttons';
import { css } from 'office-ui-fabric-react';
import * as React from 'react';

export type VirtualKeyboardViewDeps = VirtualKeyboardButtonsDeps;
export type VirtualKeyboardViewProps = {
    deps: VirtualKeyboardViewDeps;
    narrowModeStatus: NarrowModeStatus;
};

export const VirtualKeyboardView = NamedFC<VirtualKeyboardViewProps>(
    'VirtualKeyboardView',
    props => {
        return (
            <div className={css(commonStyles.visualHelperSection)}>
                <h2 className={commonStyles.header}>Virtual Keyboard</h2>
                <div>
                    Selecting these keyboard buttons will initiate keyboard events directly to your
                    connected device and show ‘Tab Stops’ visualizations on your app.
                </div>
                <VirtualKeyboardButtons {...props} />
            </div>
        );
    },
);
