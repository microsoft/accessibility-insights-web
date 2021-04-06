// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { VisualizationType } from 'common/types/visualization-type';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './assessment-instance-selected-button.scss';

export interface AssessmentInstanceSelectedButtonProps {
    test: VisualizationType;
    step: string;
    selector: string;
    isVisualizationEnabled: boolean;
    isVisible: boolean;
    onSelected: (
        selected: boolean,
        test: VisualizationType,
        step: string,
        selector: string,
    ) => void;
}

export class AssessmentInstanceSelectedButton extends React.Component<AssessmentInstanceSelectedButtonProps> {
    public render(): JSX.Element {
        const { isVisualizationEnabled, isVisible } = this.props;

        const iconStyling = classNames({
            [styles.instanceVisibilityButton]: true,
            [styles.testInstanceSelectedHiddenButton]: !isVisible,
        });

        const iconPropsStyling = classNames({
            [styles.testInstanceSelected]: isVisualizationEnabled,
            [styles.testInstanceSelectedHidden]: !isVisible && isVisualizationEnabled,
            [styles.testInstanceSelectedVisible]: isVisible && isVisualizationEnabled,
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

    private onButtonClicked = (): void => {
        if (this.props.isVisible) {
            const checked = !this.props.isVisualizationEnabled;
            this.props.onSelected(checked, this.props.test, this.props.step, this.props.selector);
        }
    };
}
