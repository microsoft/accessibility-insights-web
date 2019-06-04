// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSection } from './result-section';

export type PassedChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const PassedChecksSection = NamedSFC<PassedChecksSectionProps>('PassedChecksSection', ({ scanResult }) => (
    <ResultSection title="Passed checks" rules={scanResult.passes} containerClassName="passed-checks-section" outcomeType="pass" />
));
