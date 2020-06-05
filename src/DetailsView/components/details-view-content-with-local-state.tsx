// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import * as React from 'react';

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

    public render(): JSX.Element {
        return (
            <DetailsViewContent
                {...this.props}
                isSideNavOpen={this.state.isSideNavOpen}
                setSideNavOpen={(isOpen: boolean) => this.setSideNavOpen(isOpen)}
            />
        );
    }
}
