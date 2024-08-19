// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css, Icon } from '@fluentui/react';
import { Link } from '@fluentui/react-components';
import { NamedFC } from 'common/react/named-fc';
import { flatMap } from 'lodash';
import * as React from 'react';
import styles from './ad-hoc-tools-panel.scss';
import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';

export interface AdHocToolsPanelProps {
    backLinkHandler: () => void;
    diagnosticViewToggleFactory: DiagnosticViewToggleFactory;
}

const toggleShouldNotHaveDivider = (
    index: number,
    totalRows: number,
    toggles: JSX.Element[],
): boolean => {
    return (index + 1) % totalRows === 0 || index === toggles.length - 1;
};

export const AdHocToolsPanel = NamedFC<AdHocToolsPanelProps>('AdHocToolsPanel', props => {
    const getTogglesWithDividers = () => {
        const toggles = props.diagnosticViewToggleFactory.createTogglesForAdHocToolsPanel();

        let dividerIndex = 0;

        const getDivider = () => (
            <span key={`divider-${dividerIndex++}`} className={styles.divider}></span>
        );

        const totalRows = 4;

        const result = flatMap(toggles, (toggle, index) => {
            if (toggleShouldNotHaveDivider(index, totalRows, toggles)) {
                return [toggle];
            }

            if (index === toggles.length) {
                return [toggles];
            }

            return [toggle, getDivider()];
        });

        return result;
    };

    const togglesWithDividers = getTogglesWithDividers();

    return (
        <div className={css('main-section', styles.adHocToolsPanel)}>
            <main className={styles.adHocToolsGrid}>{togglesWithDividers}</main>
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
