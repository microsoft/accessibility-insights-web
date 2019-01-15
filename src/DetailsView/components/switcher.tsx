// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as React from 'react';

import { DetailsViewPivotType } from '../../../src/common/types/details-view-pivot-type';
import { NamedSFC } from '../../common/react/named-sfc';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type SwitcherDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface SwitcherProps {
    deps: SwitcherDeps;
    pivotKey: DetailsViewPivotType;
}

export const Switcher = NamedSFC<SwitcherProps>('Switcher', props => {

    const onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <div className="switcher-dropdown-option">
                {option.data &&
                    option.data.icon && (
                        <Icon iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                    )}
                <span>{option.text}</span>
            </div>
        );
    };

    const onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return (
            <div className="switcher-dropdown-option">
                {option.data &&
                    option.data.icon && (
                        <Icon iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                    )}
                <span>{option.text}</span>
            </div>
        );
    };

    const { deps, pivotKey } = props;
    const { detailsViewActionMessageCreator } = deps;

    const onOptionClick = (event, option?: IDropdownOption): void => {
        detailsViewActionMessageCreator.sendPivotItemClicked(DetailsViewPivotType[option.data.key]);
    };

    return (
        <Dropdown
            responsiveMode={ResponsiveMode.large}
            selectedKey={pivotKey}
            onRenderOption={onRenderOption}
            onRenderTitle={onRenderTitle}
            onChange={onOptionClick}
            options={[
                {
                    key: DetailsViewPivotType.fastPass, text: 'FastPass', data: {
                        icon: 'Rocket',
                        key: DetailsViewPivotType.fastPass,
                    },
                },
                {
                    key: DetailsViewPivotType.assessment, text: 'Assessment', data: {
                        icon: 'testBeaker',
                        key: DetailsViewPivotType.assessment,
                    },
                },
            ]}
        />
    );
});
