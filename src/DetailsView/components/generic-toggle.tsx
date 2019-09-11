// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';

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
        <div className={'generic-toggle-component'}>
            <div className={'toggle-container'}>
                <div className={'toggle-name'}>{props.name}</div>
                <Toggle
                    id={props.id}
                    className={'toggle'}
                    checked={props.enabled}
                    onClick={onClick}
                    onText={'On'}
                    offText={'Off'}
                    ariaLabel={props.name}
                />
            </div>
            <div className={'toggle-description'}>{props.description}</div>
        </div>
    );
});
