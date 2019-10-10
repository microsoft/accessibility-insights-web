// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';
import { actionableIconsContainer, headerText, titleContainer, windowTitle } from './window-title.scss';

export interface WindowTitleProps {
    title: string;
    children?: JSX.Element;
    actionableIcons?: JSX.Element[];
    className?: string;
}

export const WindowTitle = NamedFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    return (
        <header className={[windowTitle, props.className].filter(c => c != null).join(' ')}>
            <div className={titleContainer}>
                {props.children}
                <h1 className={headerText}>{props.title}</h1>
            </div>
            {getIconsContainer(props.actionableIcons)}
        </header>
    );
});

function getIconsContainer(icons?: JSX.Element[]): JSX.Element {
    if (icons != null && icons.length > 0) {
        return <div className={actionableIconsContainer}>{icons}</div>;
    }

    return null;
}
