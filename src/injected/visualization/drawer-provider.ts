// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';

import { NavigatorUtils } from 'common/navigator-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { getCellAndHeaderElementsFromResult } from 'injected/visualization/get-cell-and-header-elements';
import { TableHeadersAttributeFormatter } from 'injected/visualization/table-headers-formatter';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { TabbableElementsHelper } from '../../common/tabbable-elements-helper';
import { DeepPartial } from '../../common/types/deep-partial';
import { WindowUtils } from '../../common/window-utils';
import { ClientUtils } from '../client-utils';
import { DetailsDialogHandler } from '../details-dialog-handler';
import { ShadowUtils } from '../shadow-utils';
import { CenterPositionCalculator } from './center-position-calculator';
import { CustomWidgetsFormatter } from './custom-widgets-formatter';
import { Drawer } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { Formatter, SVGDrawerConfiguration } from './formatter';
import { FrameFormatter } from './frame-formatter';
import { HeadingFormatter } from './heading-formatter';
import { HighlightBoxDrawer } from './highlight-box-drawer';
import { HighlightBoxFormatter } from './highlight-box-formatter';
import { IssuesFormatter } from './issues-formatter';
import { LandmarkFormatter } from './landmark-formatter';
import { NonTextComponentFormatter } from './non-text-component-formatter';
import { NullDrawer } from './null-drawer';
import { SingleTargetDrawer } from './single-target-drawer';
import { SingleTargetFormatter } from './single-target-formatter';
import { SVGDrawer } from './svg-drawer';
import { SVGShapeFactory } from './svg-shape-factory';
import { SVGSolidShadowFilterFactory } from './svg-solid-shadow-filter-factory';
import { TabStopsFormatter } from './tab-stops-formatter';

export type IPartialSVGDrawerConfiguration = DeepPartial<SVGDrawerConfiguration>;

export class DrawerProvider {
    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
        private readonly navigatorUtils: NavigatorUtils,
        private readonly shadowUtils: ShadowUtils,
        private readonly drawerUtils: DrawerUtils,
        private readonly clientUtils: ClientUtils,
        private readonly dom: Document,
        private readonly frameMessenger: FrameMessenger,
        private readonly browserAdapter: BrowserAdapter,
        private readonly getRTLFunc: typeof getRTL,
        private readonly detailsDialogHandler: DetailsDialogHandler,
    ) {}

    public createNullDrawer(): Drawer {
        return new NullDrawer();
    }

    public createSingleTargetDrawer(className: string): Drawer {
        return new SingleTargetDrawer(this.drawerUtils, new SingleTargetFormatter(className));
    }

    public createSVGDrawer(config: IPartialSVGDrawerConfiguration = null): Drawer {
        const tabbableElementsHelper = new TabbableElementsHelper(this.htmlElementUtils);
        const centerPositionCalculator = new CenterPositionCalculator(
            this.drawerUtils,
            this.windowUtils,
            tabbableElementsHelper,
            this.clientUtils,
        );
        const containerClass = 'insights-tab-stops';
        return new SVGDrawer(
            this.dom,
            containerClass,
            this.windowUtils,
            this.shadowUtils,
            this.drawerUtils,
            new TabStopsFormatter(config),
            centerPositionCalculator,
            new SVGSolidShadowFilterFactory(this.drawerUtils, containerClass),
            new SVGShapeFactory(this.drawerUtils),
        );
    }

    public createFrameDrawer(): Drawer {
        const formatter = new FrameFormatter();
        return this.createDrawer('insights-frame', formatter);
    }

    public createHeadingsDrawer(): Drawer {
        const formatter = new HeadingFormatter(window);
        return this.createDrawer('insights-heading', formatter);
    }

    public createLandmarksDrawer(): Drawer {
        const formatter = new LandmarkFormatter();
        return this.createDrawer('insights-landmark', formatter);
    }

    public createIssuesDrawer(): Drawer {
        const formatter = new IssuesFormatter(
            this.frameMessenger,
            this.htmlElementUtils,
            this.windowUtils,
            this.navigatorUtils,
            this.shadowUtils,
            this.browserAdapter,
            this.getRTLFunc,
            this.detailsDialogHandler,
        );
        return this.createDrawer('insights-issues', formatter);
    }

    public createHighlightBoxDrawer(): Drawer {
        const formatter = new HighlightBoxFormatter();
        return this.createDrawer('insights-general-highlight-box', formatter);
    }

    public createCustomWidgetsDrawer(): Drawer {
        const formatter = new CustomWidgetsFormatter();
        return this.createDrawer('insights-custom-widgets', formatter);
    }

    public createNonTextComponentDrawer(): Drawer {
        const formatter = new NonTextComponentFormatter();
        return this.createDrawer('non-text-component', formatter);
    }

    public createTableHeaderAttributeDrawer(): Drawer {
        const formatter = new TableHeadersAttributeFormatter();

        return new HighlightBoxDrawer(
            this.dom,
            'insights-header-attribute-highlight-box',
            this.windowUtils,
            this.shadowUtils,
            this.drawerUtils,
            this.clientUtils,
            formatter,
            getCellAndHeaderElementsFromResult,
        );
    }

    private createDrawer(containerClass: string, formatter: Formatter): Drawer {
        return new HighlightBoxDrawer(
            this.dom,
            containerClass,
            this.windowUtils,
            this.shadowUtils,
            this.drawerUtils,
            this.clientUtils,
            formatter,
        );
    }
}
