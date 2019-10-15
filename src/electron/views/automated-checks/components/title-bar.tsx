// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { brand } from 'content/strings/application';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { WindowTitle, WindowTitleDeps } from 'electron/views/device-connect-view/components/window-title';
import { BrandWhite } from 'icons/brand/white/brand-white';
import { titleBar } from './title-bar.scss';

export type TitleBarDeps = {
    windowFrameActionCreator: WindowFrameActionCreator;
} & WindowTitleDeps;

export interface TitleBarProps {
    deps: TitleBarDeps;
    windowStateStoreData: WindowStateStoreData;
}

export const TitleBar = NamedFC<TitleBarProps>('TitleBar', (props: TitleBarProps) => {
    const minimize = () => props.deps.windowFrameActionCreator.minimize();
    const maximizeOrRestore = () =>
        props.windowStateStoreData.currentWindowState === 'maximized' || props.windowStateStoreData.currentWindowState === 'fullScreen'
            ? props.deps.windowFrameActionCreator.restore()
            : props.deps.windowFrameActionCreator.maximize();

    const close = () => props.deps.windowFrameActionCreator.close();

    const icons = [
        <ActionButton
            ariaHidden={true}
            iconProps={{
                iconName: 'ChromeMinimize',
            }}
            id="minimize-button"
            onClick={minimize}
            tabIndex={-1}
            key="minimize"
        />,
        <ActionButton
            ariaHidden={true}
            iconProps={{
                iconName: 'Stop',
            }}
            id="maximize-button"
            onClick={maximizeOrRestore}
            tabIndex={-1}
            key="maximize"
        />,
        <ActionButton
            ariaHidden={true}
            iconProps={{
                iconName: 'Cancel',
            }}
            id="close-button"
            onClick={close}
            tabIndex={-1}
            key="close"
        />,
    ];

    return (
        <WindowTitle
            title={brand}
            actionableIcons={icons}
            windowStateStoreData={props.windowStateStoreData}
            deps={props.deps}
            className={titleBar}
        >
            <BrandWhite />
        </WindowTitle>
    );
});
