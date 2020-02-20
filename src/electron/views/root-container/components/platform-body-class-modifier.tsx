// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyClassModifier } from 'common/components/body-class-modifier';
import { DocumentManipulator } from 'common/document-manipulator';
import { NamedFC } from 'common/react/named-fc';
import { PlatformInfo } from 'electron/window-management/platform-info';
import * as React from 'react';

export type PlatformBodyClassModifierDeps = {
    documentManipulator: DocumentManipulator;
    platformInfo: PlatformInfo;
};

export type PlatformBodyClassModifierProps = {
    deps: PlatformBodyClassModifierDeps;
};

export const PlatformBodyClassModifier = NamedFC<PlatformBodyClassModifierProps>(
    'PlatformBodyClassModifier',
    props => {
        if (!props.deps.platformInfo.isMac()) {
            return null;
        }

        return (
            <BodyClassModifier
                documentManipulator={props.deps.documentManipulator}
                classNames={['is-mac-os']}
            />
        );
    },
);
