// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import { LinkComponentType } from '../types/link-component-type';

export type PrivacyStatementTextDeps = {
    LinkComponent: LinkComponentType;
};

export type PrivacyStatementTextProps = {
    deps: PrivacyStatementTextDeps;
};

export const PrivacyStatementText = NamedFC<PrivacyStatementTextProps>('PrivacyStatementText', props => (
    <>
        Read our{' '}
        <props.deps.LinkComponent href="http://go.microsoft.com/fwlink/?LinkId=521839"> privacy statement</props.deps.LinkComponent> to
        learn more.
    </>
));

export const PrivacyStatementPopupText = NamedFC<PrivacyStatementTextProps>('PrivacyStatementPopupText', props => (
    <>
        You can change this choice anytime in settings. <PrivacyStatementText deps={props.deps}></PrivacyStatementText>
    </>
));
