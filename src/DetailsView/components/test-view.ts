// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdhocIssuesTestViewDeps, IAdhocIssuesTestViewProps } from './adhoc-issues-test-view';
import { AdhocStaticTestViewProps, AdhocStaticTestViewDeps } from './adhoc-static-test-view';
import { AssessmentTestViewDeps, IAssessmentTestViewProps } from './assessment-test-view';

export type TestViewDeps = AssessmentTestViewDeps & AdhocIssuesTestViewDeps & AdhocStaticTestViewDeps;
export type TestViewProps = IAssessmentTestViewProps & IAdhocIssuesTestViewProps & AdhocStaticTestViewProps;
