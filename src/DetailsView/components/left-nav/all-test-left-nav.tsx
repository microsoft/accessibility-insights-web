// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import { IPivotItemProps, Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';

import { PivotConfiguration } from '../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../common/types/visualization-type';
import { getTestLinks } from './links-provider';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { NavLinkHandler } from './nav-link-handler';

export interface AllTestLeftNavDeps {
    pivotConfiguration: PivotConfiguration;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    navLinkHandler: NavLinkHandler;
}

export interface AllTestLeftNavProps {
    deps: AllTestLeftNavDeps;
    selectedPivot: DetailsViewPivotType;
    selectedDetailsView: VisualizationType;
    renderNav: (selectedKey: string, links: INavLink[], renderIcon: (link: INavLink) => JSX.Element) => JSX.Element;
    onPivotItemClick: (item: PivotItem, event?: React.MouseEvent<HTMLElement>) => void;
}

export const AllTestLeftNav = NamedSFC<AllTestLeftNavProps>('AllTestLeftNav', props => {
    const {
        onPivotItemClick,
        selectedPivot,
        selectedDetailsView,
        renderNav,
        deps,
    } = props;

    const { pivotConfiguration, visualizationConfigurationFactory, navLinkHandler } = deps;

    const onRenderPivotItem = (pivotItemProps?: IPivotItemProps): JSX.Element => {
        const { itemIcon, headerText } = pivotItemProps;

        return (
            <span className={css('ms-Pivot-link-content')}>
                <span className={'ms-Pivot-icon'}>
                    <Icon iconName={itemIcon} />
                </span>
                <span className={'ms-Pivot-text'}> {headerText}</span>
            </span>
        );
    };

    const renderIcon = (link: INavLink): JSX.Element => {
        return (
            <div className={'index-circle'}>
                {link.index}
            </div>
        );
    };

    const getPivotItem = (pivotType: DetailsViewPivotType, headerText: string, itemIcon: string, links: INavLink[]): JSX.Element => {
        const selectedKey: string = VisualizationType[selectedDetailsView];

        return (
            <PivotItem
                itemKey={DetailsViewPivotType[pivotType]}
                key={DetailsViewPivotType[pivotType]}
                headerText={headerText}
                itemIcon={itemIcon}
                onRenderItemLink={onRenderPivotItem}
            >
                {renderNav(selectedKey, links, renderIcon)}
            </PivotItem>
        );
    };

    const fastPassLinks = getTestLinks(
        DetailsViewPivotType.fastPass,
        pivotConfiguration,
        visualizationConfigurationFactory,
        navLinkHandler.onTestClick,
    );

    const allTestLinks = getTestLinks(
        DetailsViewPivotType.allTest,
        pivotConfiguration,
        visualizationConfigurationFactory,
        navLinkHandler.onTestClick,
    );

    const fastPassPivot = getPivotItem(DetailsViewPivotType.fastPass, 'FastPass', 'Rocket', fastPassLinks);
    const allTestPivot = getPivotItem(DetailsViewPivotType.allTest, 'All tests', 'testBeaker', allTestLinks);

    const pivotItems = [fastPassPivot, allTestPivot];
    return (
        <Pivot
            className="details-view-nav-pivots"
            onLinkClick={onPivotItemClick}
            selectedKey={DetailsViewPivotType[selectedPivot]}
        >
            {pivotItems}
        </Pivot>
    );
});
