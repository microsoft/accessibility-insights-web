// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-sfc';

export interface WindowTitleProps {
    title: string;
    children?: JSX.Element;
}

export const WindowTitle = NamedFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    return (
        <header className="window-title">
            <div>
                {props.children}
                <h1 className="header-text">{props.title}</h1>
            </div>
        </header>
    );
});
