// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type DetailsViewContentWithLocalStateProps = DetailsViewContainerProps;
export type DetailsViewContentState = {
    isSideNavOpen: boolean;
};

export class DetailsViewContentWithLocalState extends React.Component<
    DetailsViewContentWithLocalStateProps,
    DetailsViewContentState
> {
    constructor(props: DetailsViewContentWithLocalStateProps) {
        super(props);
        this.state = { isSideNavOpen: false };
    }

    private setSideNavOpen(isOpen: boolean): void {
        this.setState({ isSideNavOpen: isOpen });
    }

    private renderAccordingToWidth(dimensions: { width: number }): JSX.Element {
        const isNarrowMode =
            this.props.storeState.featureFlagStoreData[FeatureFlags.reflowUI] === true &&
            dimensions.width < 600;
        return (
            <DetailsViewContent
                {...this.props}
                isNarrowMode={isNarrowMode}
                isSideNavOpen={this.state.isSideNavOpen}
                setSideNavOpen={(isOpen: boolean) => this.setSideNavOpen(isOpen)}
            />
        );
    }

    public render(): JSX.Element {
        return (
            <ReactResizeDetector
                handleWidth
                querySelector="body"
                render={dimension => this.renderAccordingToWidth(dimension)}
            />
        );
    }
}
