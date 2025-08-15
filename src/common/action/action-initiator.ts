// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type ActionInitiator<D extends {}> = (
    event: React.MouseEvent<any> | MouseEvent,
    details: D,
) => void;

export type ActionInitiators = {
openExternalLink: ActionInitiator<{ href: any }>;
};
