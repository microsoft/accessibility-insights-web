// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { CommandMessageResponse } from 'injected/frameCommunicators/respondable-command-message-communicator';

export interface DetailsDialogWindowMessage {
    data: HtmlElementAxeResults;
}

export type RenderDialog = (data: HtmlElementAxeResults) => void;

export interface DialogRenderer {
    render(data: HtmlElementAxeResults): Promise<CommandMessageResponse | null>;
}
