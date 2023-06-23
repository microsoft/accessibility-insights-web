// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type CardInteractionSupport = {
    supportsHighlighting: boolean;
    supportsIssueFiling: boolean;
    supportsCopyFailureDetails: boolean;
};

export const allCardInteractionsSupported: CardInteractionSupport = {
    supportsHighlighting: true,
    supportsIssueFiling: true,
    supportsCopyFailureDetails: true,
};

export const noCardInteractionsSupported: CardInteractionSupport = {
    supportsHighlighting: false,
    supportsIssueFiling: false,
    supportsCopyFailureDetails: false,
};
