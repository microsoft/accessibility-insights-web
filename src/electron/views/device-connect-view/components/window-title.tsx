// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';
import { actionableIconsContainer, headerText, titleContainer, windowTitle, macWindowTitle } from './window-title.scss';
import { PlatformInfo } from 'electron/platform-info';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';

export interface WindowTitleDeps {
    platformInfo: PlatformInfo;
}
export interface WindowTitleProps {
    deps: WindowTitleDeps,
    title: string;
    children?: JSX.Element;
    actionableIcons?: JSX.Element[];
    className?: string;
    windowStateStoreData: WindowStateStoreData
}

export const WindowTitle = NamedFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    if (props.windowStateStoreData.currentWindowState == "fullScreen") {
        return null;
    }

    const windowtitleClassNames = [windowTitle, props.className].filter(c => c != null);

    if (props.deps.platformInfo.isMac()) {
        windowtitleClassNames.push(macWindowTitle);
    }
    return (
        <header className={windowtitleClassNames.join(' ')}>
            <div className={titleContainer}>
                {props.children}
                <h1 className={headerText}>{props.title}</h1>
            </div>
            {getIconsContainer(props)}
        </header>
    );
});

function getIconsContainer(props: WindowTitleProps): JSX.Element {
    if (!props.deps.platformInfo.isMac() && !isEmpty(props.actionableIcons)) {
        return <div className={actionableIconsContainer}>{props.actionableIcons}</div>;
    }

    return null;
}
