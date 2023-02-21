// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface ITestViewContainerProvider {
    createStaticTestViewContainer(props: any): JSX.Element;
    createTabStopsTestViewContainer(props: any): JSX.Element;
    createNeedsReviewTestViewContainer(props: any): JSX.Element;
    createIssuesTestViewContainer(props: any): JSX.Element;
    createAssessmentTestViewContainer(props: any): JSX.Element;
}
