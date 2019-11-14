// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SingleElementSelector } from '../common/types/store-data/scoping-store-data';
import { WindowUtils } from '../common/window-utils';
import { ElementFinderByPosition } from './element-finder-by-position';
import { ShadowUtils } from './shadow-utils';

export type IInspectCallback = (
    event: MouseEvent,
    selector: SingleElementSelector,
) => void;
export class ScopingListener {
    public static onClickTimeout: number = 250;
    public static onHoverTimeout: number = 200;
    private readonly windowUtils: WindowUtils;
    private readonly elementFinderByPosition: ElementFinderByPosition;
    private readonly shadowUtils: ShadowUtils;
    private readonly dom: Document;
    private onInspectClick: IInspectCallback;
    private onInspectHover: (selector: string[]) => void;
    private onClickCurrentTimeoutId: number = null;
    private onHoverCurrentTimeoutId: number = null;

    public static readonly scopeLayoutContainerId =
        'insights-inspect-selector-layout';

    constructor(
        elementFinderByPosition: ElementFinderByPosition,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        dom: Document,
    ) {
        this.windowUtils = windowUtils;
        this.elementFinderByPosition = elementFinderByPosition;
        this.shadowUtils = shadowUtils;
        this.dom = dom || document;
    }

    public start(
        onInspectClick: IInspectCallback,
        onInspectHover: (selector: string[]) => void,
    ): void {
        const shadowContainer = this.shadowUtils.getShadowContainer();
        this.addContainer(shadowContainer);
        this.onInspectClick = onInspectClick;
        this.onInspectHover = onInspectHover;
        this.dom.addEventListener('click', this.onClick);
        this.dom.addEventListener('mousemove', this.onHover);
    }

    public stop(): void {
        const shadowContainer = this.shadowUtils.getShadowContainer();
        this.removeContainer(shadowContainer);
        this.dom.removeEventListener('click', this.onClick);
        this.dom.removeEventListener('mousemove', this.onHover);
    }

    private removeContainer(shadowContainer: HTMLElement): void {
        const container = shadowContainer.querySelector(
            `#${ScopingListener.scopeLayoutContainerId}`,
        );
        if (container) {
            shadowContainer.removeChild(container);
        }
    }

    private addContainer(shadowContainer: HTMLElement): void {
        this.removeContainer(shadowContainer);

        const scopeLayout = this.dom.createElement('div');
        scopeLayout.style.position = 'fixed';
        scopeLayout.style.left = '0';
        scopeLayout.style.top = '0';
        scopeLayout.style.width = '100%';
        scopeLayout.style.height = '100%';
        scopeLayout.style.pointerEvents = 'auto';
        scopeLayout.style.cursor = 'crosshair';
        scopeLayout.style.visibility = 'visible';
        scopeLayout.id = ScopingListener.scopeLayoutContainerId;

        shadowContainer.appendChild(scopeLayout);
    }

    protected onClick = (event: MouseEvent): void => {
        if (this.onClickCurrentTimeoutId != null) {
            this.windowUtils.clearTimeout(this.onClickCurrentTimeoutId);
            this.onClickCurrentTimeoutId = null;
        }

        this.onClickCurrentTimeoutId = this.windowUtils.setTimeout(() => {
            this.processRequestForEvent(event).then(path => {
                this.onInspectClick(event, path);
            });
        }, ScopingListener.onClickTimeout);
    };

    protected onHover = (event: MouseEvent): void => {
        if (this.onHoverCurrentTimeoutId != null) {
            this.windowUtils.clearTimeout(this.onHoverCurrentTimeoutId);
            this.onHoverCurrentTimeoutId = null;
        }

        this.onHoverCurrentTimeoutId = this.windowUtils.setTimeout(() => {
            this.processRequestForEvent(event).then(path => {
                this.onInspectHover(path);
            });
        }, ScopingListener.onHoverTimeout);
    };

    private processRequestForEvent = (
        event: MouseEvent,
    ): PromiseLike<SingleElementSelector> => {
        return this.elementFinderByPosition.processRequest({
            x: event.clientX,
            y: event.clientY,
        });
    };
}
