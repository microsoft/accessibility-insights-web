// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { VisualizationType } from '../../common/types/visualization-type';

export interface AssessmentInstanceSelectedButtonProps {
    test: VisualizationType;
    step: string;
    selector: string;
    isVisualizationEnabled: boolean;
    isVisible: boolean;
    onSelected: (selected, test, step, selector) => void;
}

export class AssessmentInstanceSelectedButton extends React.Component<
    AssessmentInstanceSelectedButtonProps
> {
    public render(): JSX.Element {
        const { isVisualizationEnabled, isVisible } = this.props;

        const iconStyling = classNames({
            'instance-visibility-button': true,
            'test-instance-selected-hidden-button': !isVisible,
        });

        const iconPropsStyling = classNames({
            'test-instance-selected': isVisualizationEnabled,
            'test-instance-selected-hidden': !isVisible && isVisualizationEnabled,
            'test-instance-selected-visible': isVisible && isVisualizationEnabled,
        });

        return (
            <IconButton
                className={iconStyling}
                iconProps={{
                    className: iconPropsStyling,
                    iconName: isVisible ? (isVisualizationEnabled ? 'view' : 'checkBox') : 'hide2',
                }}
                disabled={!isVisible}
                onClick={this.onButtonClicked}
                role="checkbox"
                aria-checked={isVisualizationEnabled}
                aria-label="Visualization"
            />
        );
    }

    private onButtonClicked = (event: React.MouseEvent<any>): void => {
        if (this.props.isVisible) {
            const checked = !this.props.isVisualizationEnabled;
            this.props.onSelected(checked, this.props.test, this.props.step, this.props.selector);
        }
    };
}
