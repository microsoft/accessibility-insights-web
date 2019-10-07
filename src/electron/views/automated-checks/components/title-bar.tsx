// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { BrandWhite } from 'icons/brand/white/brand-white';
import { titleBar } from './title-bar.scss';

export type TitleBarDeps = {
    currentWindow: BrowserWindow;
};

export interface TitleBarProps {
    deps: TitleBarDeps;
}

export const TitleBar = NamedFC<TitleBarProps>('TitleBar', (props: TitleBarProps) => {
    const currrentWindow = props.deps.currentWindow;
    const minimize = () => currrentWindow.minimize();
    const maximize = () => (currrentWindow.isMaximized() ? currrentWindow.restore() : currrentWindow.maximize());
    const close = () => currrentWindow.close();

    return (
        <div className={titleBar}>
            <BrandWhite />
            <ActionButton
                ariaHidden={true}
                iconProps={{
                    iconName: 'Cancel',
                }}
                id="close-button"
                onClick={close}
                tabIndex={-1}
            />
            <ActionButton
                ariaHidden={true}
                iconProps={{
                    iconName: 'Stop',
                }}
                id="maximize-button"
                onClick={maximize}
                tabIndex={-1}
            />
            <ActionButton
                ariaHidden={true}
                iconProps={{
                    iconName: 'ChromeMinimize',
                }}
                id="minimize-button"
                onClick={minimize}
                tabIndex={-1}
            />
        </div>
    );
});
