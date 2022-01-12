// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Toggle } from '@fluentui/react';
import * as React from 'react';
import * as styles from './generic-toggle.scss';

export interface GenericToggleProps {
    enabled: boolean;
    name: string;
    id: string;
    description?: string | JSX.Element;
    onClick: (id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => void;
}

export const GenericToggle = NamedFC<GenericToggleProps>('GenericToggle', props => {
    const onClick = (event: React.MouseEvent<HTMLElement>): void => {
        props.onClick(props.id, !props.enabled, event);
    };

    return (
        <div className={styles.genericToggleComponent}>
            <div className={styles.toggleContainer}>
                <div className={styles.toggleName}>{props.name}</div>
                <Toggle
                    id={props.id}
                    className={styles.toggle}
                    checked={props.enabled}
                    onClick={onClick}
                    onText={'On'}
                    offText={'Off'}
                    ariaLabel={props.name}
                />
            </div>
            <div className={styles.toggleDescription}>{props.description}</div>
        </div>
    );
});
