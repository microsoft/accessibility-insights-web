// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { DetailsHeader as FabricDetailsHeader } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsHeader';

export class DetailsHeader extends FabricDetailsHeader {
    // this is a workaround, since DetailsHeader, doesn't honor the initial state if the selection.
    constructor(props: IDetailsHeaderProps) {
        super(props);
        this.state = {
            ...this.state,
            isAllSelected: props.selection.isAllSelected(),
        };
    }
}
