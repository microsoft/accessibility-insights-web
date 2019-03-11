// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';

import { ClientBrowserAdapter } from '../../common/client-browser-adapter';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { TabbableElementsHelper } from '../../common/tabbable-elements-helper';
import { DeepPartial } from '../../common/types/deep-partial';
import { WindowUtils } from '../../common/window-utils';
import { ClientUtils } from '../client-utils';
import { FrameCommunicator } from '../frameCommunicators/frame-communicator';
import { ShadowUtils } from '../shadow-utils';
import { CenterPositionCalculator } from './center-position-calculator';
import { CustomWidgetsFormatter } from './custom-widgets-formatter';
import { Drawer } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { FrameFormatter } from './frame-formatter';
import { HeadingFormatter } from './heading-formatter';
import { HighlightBoxFormatter } from './highlight-box-formatter';
import { IDrawer } from './idrawer';
import { IFormatter, ISVGDrawerConfiguration } from './formatter';
import { IssuesFormatter } from './issues-formatter';
import { LandmarkFormatter } from './landmark-formatter';
import { NullDrawer } from './null-drawer';
import { SingleTargetDrawer } from './single-target-drawer';
import { SingleTargetFormatter } from './single-target-formatter';
import { SVGDrawerV2 } from './svg-drawer-v2';
import { SVGShapeFactory } from './svg-shape-factory';
import { SVGSolidShadowFilterFactory } from './svg-solid-shadow-filter-factory';
import { TabStopsFormatter } from './tab-stops-formatter';

export type IPartialSVGDrawerConfiguration = DeepPartial<ISVGDrawerConfiguration>;

export class DrawerProvider {
    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
        private readonly shadowUtils: ShadowUtils,
        private readonly drawerUtils: DrawerUtils,
        private readonly clientUtils: ClientUtils,
        private readonly dom: Document,
        private readonly frameCommunicator: FrameCommunicator,
        private readonly clientBrowserAdapter: ClientBrowserAdapter,
        private readonly getRTLFunc: typeof getRTL,
    ) {}

    public createNullDrawer(): IDrawer {
        return new NullDrawer();
    }

    public createSingleTargetDrawer(className: string): IDrawer {
        return new SingleTargetDrawer(this.drawerUtils, new SingleTargetFormatter(className));
    }

    public createSVGDrawer(config: IPartialSVGDrawerConfiguration = null): IDrawer {
        const tabbableElementsHelper = new TabbableElementsHelper(this.htmlElementUtils);
        const centerPositionCalculator = new CenterPositionCalculator(
            this.drawerUtils,
            this.windowUtils,
            tabbableElementsHelper,
            this.clientUtils,
        );
        const containerClass = 'insights-tab-stops';
        return new SVGDrawerV2(
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

    public createFrameDrawer(): IDrawer {
        const formatter = new FrameFormatter();
        return this.createDrawer('insights-frame', formatter);
    }

    public createHeadingsDrawer(): IDrawer {
        const formatter = new HeadingFormatter(window, this.clientUtils);
        return this.createDrawer('insights-heading', formatter);
    }

    public createLandmarksDrawer(): IDrawer {
        const formatter = new LandmarkFormatter();
        return this.createDrawer('insights-landmark', formatter);
    }

    public createIssuesDrawer(): IDrawer {
        const formatter = new IssuesFormatter(
            this.frameCommunicator,
            this.htmlElementUtils,
            this.windowUtils,
            this.shadowUtils,
            this.clientBrowserAdapter,
            this.getRTLFunc,
        );
        return this.createDrawer('insights-issues', formatter);
    }

    public createHighlightBoxDrawer(): IDrawer {
        const formatter = new HighlightBoxFormatter();
        return this.createDrawer('insights-general-highlight-box', formatter);
    }

    public createCustomWidgetsDrawer(): IDrawer {
        const formatter = new CustomWidgetsFormatter();
        return this.createDrawer('insights-custom-widgets', formatter);
    }

    private createDrawer(containerClass: string, formatter: IFormatter): IDrawer {
        return new Drawer(this.dom, containerClass, this.windowUtils, this.shadowUtils, this.drawerUtils, this.clientUtils, formatter);
    }
}
