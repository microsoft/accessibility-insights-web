// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { css, Icon, Link } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './ad-hoc-tools-panel.scss';
import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';

export interface AdHocToolsPanelProps {
    backLinkHandler: () => void;
    diagnosticViewToggleFactory: DiagnosticViewToggleFactory;
}

export const AdHocToolsPanel = NamedFC<AdHocToolsPanelProps>('AdHocToolsPanel', props => {
    const toggles = props.diagnosticViewToggleFactory.createTogglesForAdHocToolsPanel();

    return (
        <div className={css('main-section', styles.adHocToolsPanel)}>
            <main className={styles.adHocToolsGrid}>{toggles}</main>
            <div role="navigation" className={styles.adHocToolsPanelFooter}>
                <Link
                    className={styles.link}
                    onClick={props.backLinkHandler}
                    id="back-to-launchpad-link"
                >
                    <Icon className={styles.backToLaunchPadIcon} iconName="back" />
                    Back to launch pad
                </Link>
            </div>
        </div>
    );
});
