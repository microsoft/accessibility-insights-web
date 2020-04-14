// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SettingsProps } from '../settings-props';

export const AboutSettings = NamedFC<SettingsProps>('AboutSettings', () => {
    return (
        <>
            <h3>About</h3>
            <div>
                <NewTabLink href="/LICENSE.txt">License</NewTabLink>
                <br />
                <NewTabLink href="/NOTICE.txt">Third party notices</NewTabLink>
            </div>
        </>
    );
});
