// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './device-description.scss';

export interface DeviceDescriptionProps extends DeviceMetadata {}

export const DeviceDescription = NamedFC<DeviceDescriptionProps>('DeviceDescription', props => {
    const iconName: string = props.isEmulator ? 'Devices3' : 'CellPhone';

    return (
        <React.Fragment>
            <div className={styles.content}>
                <div class="ms-Grid" dir="ltr">
                    <div class="ms-Grid-row">
                        <div class="ms-Grid-col ms-sm1">
                            <Icon iconName={iconName} className={styles.iconContent} />
                        </div>
                        <div class="ms-Grid-col ms-sm11">{props.description}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});
