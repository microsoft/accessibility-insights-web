// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';
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

    private setSideNavOpen(isOpen: boolean, event?: React.MouseEvent<any>): void {
        this.setState({ isSideNavOpen: isOpen });
        if (isOpen) {
            this.props.deps.detailsViewActionMessageCreator.leftNavPanelExpanded(event!);
        }
    }

    public render(): JSX.Element {
        return (
            <>
                <NarrowModeDetector
                    isNarrowModeEnabled={true}
                    Component={DetailsViewContent}
                    childrenProps={{
                        ...this.props,
                        isSideNavOpen: this.state.isSideNavOpen,
                        setSideNavOpen: (isOpen: boolean, event?: React.MouseEvent<any>) =>
                            this.setSideNavOpen(isOpen, event),
                    }}
                />
            </>
        );
    }
}
