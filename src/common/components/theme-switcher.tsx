// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
// tslint:disable-next-line:no-require-imports
import BodyClassName = require('react-body-classname');

export interface ThemeProps {
    isHighContrastEnabled: boolean;
}

// export const ThemeSwitcher = NamedSFC<ThemeProps>('ThemeSwitcher', ({ isHighContrastEnabled, children }) => {
//     const className = `theme-switcher${isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
//     return <div className={className}>{children}</div>;
// });

export function withThemedBody<P>(Component: React.ComponentType<P>, getTheme: (props: P) => boolean): (props: P) => JSX.Element {
    return (props: P) => {
        const isHighContrastEnabled = getTheme(props);
        const className = `theme-switcher${isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
        return (
            <BodyClassName className={className + ' hello world'}>
                <Component {...props} />
            </BodyClassName>
        );
    };
}
