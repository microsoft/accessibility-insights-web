// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdhocIssuesTestViewDeps, AdhocIssuesTestViewProps } from './adhoc-issues-test-view';
import { AdhocStaticTestViewDeps, AdhocStaticTestViewProps } from './adhoc-static-test-view';
import { AssessmentTestViewDeps, AssessmentTestViewProps } from './assessment-test-view';

export type TestViewDeps = AssessmentTestViewDeps &
    AdhocIssuesTestViewDeps &
    AdhocStaticTestViewDeps;
export type CommonTestViewProps = AssessmentTestViewProps &
    Omit<AdhocIssuesTestViewProps, 'instancesSection'> &
    AdhocStaticTestViewProps;
