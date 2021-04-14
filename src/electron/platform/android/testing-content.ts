// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    CommonInstancesSectionDeps,
    CommonInstancesSectionProps,
} from 'common/components/cards/common-instances-section-props';
import {
    TabStopsTestingContentDeps,
    TabStopsTestingContentProps,
} from 'electron/views/tab-stops/tab-stops-testing-content';

export type TestingContentDeps = CommonInstancesSectionDeps | TabStopsTestingContentDeps;

export type TestingContentProps =
    | CommonInstancesSectionProps
    | (TabStopsTestingContentProps & {
          deps: TestingContentDeps;
      });
