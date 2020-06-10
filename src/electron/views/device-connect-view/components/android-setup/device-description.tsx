// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './device-description.scss';

export interface DeviceDescriptionProps extends DeviceMetadata {
    marginTop?: string;
    marginBottom?: string;
}

export const DeviceDescription = NamedFC<DeviceDescriptionProps>('DeviceDescription', props => {
    const iconName: string = props.isEmulator ? 'Devices3' : 'CellPhone';
    const iconAriaLabel: string = props.isEmulator ? 'Emulator' : 'Device';

    const verticalMargins: React.CSSProperties = {};
    if (props.marginTop) {
        verticalMargins.marginTop = props.marginTop;
    }
    if (props.marginBottom) {
        verticalMargins.marginBottom = props.marginBottom;
    }

    return (
        <div className={styles.content} style={verticalMargins}>
            <Icon iconName={iconName} className={styles.iconContent} ariaLabel={iconAriaLabel} />
            {props.description}
        </div>
    );
});
