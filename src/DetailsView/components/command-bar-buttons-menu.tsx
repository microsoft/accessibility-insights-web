// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import { CommandBarButton, IButton, IContextualMenuItem, IRefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import * as styles from './command-bar-buttons-menu.scss';

export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element;
    renderSaveAssessmentButton?: () => JSX.Element | null;
    renderLoadAssessmentButton?: () => JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    buttonRef: IRefObject<IButton>;
    featureFlagStoreData?: FeatureFlagStoreData;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const exportButton = props.renderExportReportButton();
        const overflowItems: IContextualMenuItem[] = [];

        overflowItems.push({
            key: 'export report',
            onRender: () => <div role="menuitem">{exportButton}</div>,
        });
        if (
            props.featureFlagStoreData?.[FeatureFlags.saveAndLoadAssessment] &&
            props.renderSaveAssessmentButton &&
            props.renderLoadAssessmentButton
        ) {
            overflowItems.push(
                {
                    key: 'save assessment',
                    onRender: () => <div role="menuitem">{props.renderSaveAssessmentButton()}</div>,
                },
                {
                    key: 'load assessment',
                    onRender: () => <div role="menuitem">{props.renderLoadAssessmentButton()}</div>,
                },
            );
        }
        overflowItems.push({
            key: 'start over',
            ...props.getStartOverMenuItem(),
        });

        return (
            <CommandBarButton
                ariaLabel="More items"
                className={styles.commandBarButtonsMenu}
                role="button"
                menuIconProps={{
                    iconName: 'More',
                    className: styles.commandBarButtonsMenuButton,
                }}
                menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
                componentRef={props.buttonRef}
            />
        );
    },
);
