// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../common/types/visualization-type';
import { ScanData } from '../background/visualization-store';
import { IHtmlElementAxeResults } from '../injected/scanner-utils';

// tslint:disable-next-line:interface-name
export interface IDetailsViewProps {
    type: VisualizationType;
    visualizationData: ScanData;
    clickHandler: (event) => void;
}
