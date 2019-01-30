// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';

export interface ThemeProps {
    isHighContrastEnabled: boolean;
}

export const ThemeSwitcher = NamedSFC<ThemeProps>('ThemeSwitcher', ({ isHighContrastEnabled, children }) => {
    const className = `theme-switcher${isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
    return (
        <div className={className} >
            {children}
        </div>
    );
});
