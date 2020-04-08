// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { WindowUtils } from '../../common/window-utils';
import { RenderDialog } from '../dialog-renderer';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';
import { DrawerUtils } from './drawer-utils';
import { ElementHighlight, ElementHighlightDeps } from './element-highlight';
import { DrawerConfiguration, Formatter } from './formatter';
import { HighlightBoxDrawer } from './highlight-box-drawer';

export type HighlightVisualizationDeps = {
    drawerUtils: DrawerUtils;
    windowUtils: WindowUtils;
} & ElementHighlightDeps;

export interface HighlightVisualizationProps {
    deps: HighlightVisualizationDeps;
    elementResults: AxeResultsWithFrameLevel[];
    formatter: Formatter;
    renderDialog: RenderDialog;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const HighlightVisualization = NamedFC<HighlightVisualizationProps>(
    'HighlightVisualization',
    props => {
        const { deps, elementResults, formatter, renderDialog, featureFlagStoreData } = props;
        const { windowUtils, drawerUtils } = deps;

        const highlightElements: JSX.Element[] = [];
        const currentDom = drawerUtils.getDocumentElement();
        const body = currentDom.body;
        const bodyStyle = windowUtils.getComputedStyle(body);
        const docStyle = windowUtils.getComputedStyle(currentDom.documentElement);

        elementResults.forEach((elementResult, index) => {
            const elementsFound = currentDom.querySelectorAll(
                elementResult.target[elementResult.targetIndex],
            );

            for (let elementPos = 0; elementPos < elementsFound.length; elementPos++) {
                const currentFoundElement = elementsFound[elementPos];
                const drawerConfig = (formatter
                    ? formatter.getDrawerConfiguration(currentFoundElement, elementResult)
                    : HighlightBoxDrawer.defaultConfiguration) as DrawerConfiguration;
                const getBoundingRect =
                    drawerConfig.getBoundingRect || currentFoundElement.getBoundingClientRect;

                const elementHighlight = (
                    <ElementHighlight
                        deps={deps}
                        element={currentFoundElement}
                        elementResult={elementResult}
                        bodyStyle={bodyStyle}
                        docStyle={docStyle}
                        drawerConfig={drawerConfig}
                        dialogRender={renderDialog}
                        featureFlagStoreData={featureFlagStoreData}
                        key={`highlight-${index}-element-${elementPos}`}
                        getBoundingRect={getBoundingRect}
                    />
                );
                highlightElements.push(elementHighlight);
            }
        });

        return <>{highlightElements}</>;
    },
);
