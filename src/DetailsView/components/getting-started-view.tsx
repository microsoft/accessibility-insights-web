// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as styles from 'DetailsView/components/assessment-view.scss';
import * as React from 'react';

export interface GettingStartedViewProps {
    gettingStartedContent: JSX.Element;
}

export class GettingStartedView extends React.Component<GettingStartedViewProps> {
    public render(): JSX.Element {
        return (
            <div className={styles.assessmentGettingStartedContainer}>
                <h2>Getting Started</h2>
                {this.props.gettingStartedContent}
            </div>
        );
    }
}
