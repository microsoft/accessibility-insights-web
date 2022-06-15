// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/utilities';
import { NamedFC } from 'common/react/named-fc';
import { androidAppTitle, brand } from 'content/strings/application';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import styles from './window-title.scss';

export interface WindowTitleDeps {
    platformInfo: PlatformInfo;
}
export interface WindowTitleProps {
    deps: WindowTitleDeps;
    pageTitle: string;
    children?: JSX.Element;
    actionableIcons?: JSX.Element[];
    className?: string;
    headerTextClassName?: string;
    windowStateStoreData: WindowStateStoreData;
}

export const WindowTitle = NamedFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    if (props.windowStateStoreData.currentWindowState === 'fullScreen') {
        return null;
    }

    return (
        <header className={css(styles.windowTitle, props.className)}>
            <Helmet>
                <title>
                    {androidAppTitle} - {props.pageTitle}
                </title>
            </Helmet>
            <div className={styles.titleContainer}>
                {props.children}
                <span className={css(styles.headerText, props.headerTextClassName)}>{brand}</span>
            </div>
            {getIconsContainer(props)}
        </header>
    );
});

function getIconsContainer(props: WindowTitleProps): JSX.Element | null {
    const { platformInfo } = props.deps;

    if (platformInfo.isMac() || isEmpty(props.actionableIcons)) {
        return null;
    }

    return <div className={styles.actionableIconsContainer}>{props.actionableIcons}</div>;
}
