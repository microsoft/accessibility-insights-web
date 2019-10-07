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
    const min = () => currrentWindow.minimize();
    const max = () => (currrentWindow.isMaximized() ? currrentWindow.restore() : currrentWindow.maximize());
    const close = () => currrentWindow.close();

    return (
        <div className={titleBar}>
            <BrandWhite />
            <ActionButton
                iconProps={{
                    iconName: 'Cancel',
                }}
                onClick={close}
            />
            <ActionButton
                iconProps={{
                    iconName: 'Stop',
                }}
                onClick={max}
            />
            <ActionButton
                iconProps={{
                    iconName: 'ChromeMinimize',
                }}
                onClick={min}
            />
        </div>
    );
});
