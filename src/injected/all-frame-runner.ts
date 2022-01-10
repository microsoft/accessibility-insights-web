// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/*
This interface defines a target used by the upcoming class
AllFrameRunner (see ai-web@5036). Adding the interface early
to enable parallel work.
*/

export interface AllFrameRunnerTarget<T> {
    name: string;
    start: () => void;
    stop: () => void;
    transformChildResultForParent: (fromChild: T, messageSourceFrame: HTMLIFrameElement) => T;
    setResultCallback: (reportResults: (payload: T) => Promise<void>) => void;
}
