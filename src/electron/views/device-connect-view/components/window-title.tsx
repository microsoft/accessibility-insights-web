// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';
import { headerText, windowTitle } from './window-title.scss';

export interface WindowTitleProps {
    title: string;
    children?: JSX.Element;
}

export const WindowTitle = NamedFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    return (
        <header className={windowTitle}>
            <div>
                {props.children}
                <h1 className={headerText}>{props.title}</h1>
            </div>
        </header>
    );
});
