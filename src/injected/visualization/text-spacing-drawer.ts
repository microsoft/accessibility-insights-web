// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { Drawer, DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { SingleTargetFormatter } from './single-target-formatter';

// WCAG 2.1 SC 1.4.12 metrics, written onto each element's inline style with
// `important` priority so they override inherited values and inline `!important`.
// Keep in sync with the base rule in src/injected/styles/injected.scss.
const textSpacingProperties: ReadonlyArray<[string, string]> = [
    ['line-height', '1.5'],
    ['letter-spacing', '0.12em'],
    ['word-spacing', '0.16em'],
];

const toolContainerIds = ['accessibility-insights-root-container', 'insights-shadow-container'];

const ELEMENT_NODE = 1;

type SavedInlineStyle = Map<string, [value: string, priority: string]>;

export class TextSpacingDrawer implements Drawer {
    protected isEnabled = false;
    private target: HTMLElement | null;
    private observer: MutationObserver | null = null;
    private readonly originalStyles = new Map<HTMLElement, SavedInlineStyle>();

    constructor(
        private readonly drawerUtils: DrawerUtils,
        private readonly formatter: SingleTargetFormatter,
    ) {}

    public initialize(drawerInfo: DrawerInitData): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data ?? [];
        const myDocument = this.drawerUtils.getDocumentElement();
        this.target = this.getFirstElementTarget(myDocument, elementResults);
    }

    public drawLayout = async (): Promise<void> => {
        if (this.target != null) {
            this.target.classList.add(this.formatter.getDrawerConfiguration().injectedClassName);
            this.forEachRelevantElement(this.target, element => this.forceSpacing(element));
            this.startObserving();
        }
        this.isEnabled = true;
    };

    public eraseLayout(): void {
        this.isEnabled = false;
        this.stopObserving();
        if (this.target != null) {
            this.target.classList.remove(this.formatter.getDrawerConfiguration().injectedClassName);
        }
        this.restoreOriginalStyles();
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    private forceSpacing(element: HTMLElement): void {
        if (!this.originalStyles.has(element)) {
            const saved: SavedInlineStyle = new Map();
            for (const [property] of textSpacingProperties) {
                saved.set(property, [
                    element.style.getPropertyValue(property),
                    element.style.getPropertyPriority(property),
                ]);
            }
            this.originalStyles.set(element, saved);
        }
        for (const [property, value] of textSpacingProperties) {
            element.style.setProperty(property, value, 'important');
        }
    }

    private restoreOriginalStyles(): void {
        this.originalStyles.forEach((saved, element) => {
            saved.forEach(([value, priority], property) => {
                element.style.removeProperty(property);
                if (value !== '') {
                    element.style.setProperty(property, value, priority);
                }
            });
        });
        this.originalStyles.clear();
    }

    private forEachRelevantElement(root: Node, callback: (element: HTMLElement) => void): void {
        if (!this.isElement(root) || toolContainerIds.includes(root.id)) {
            return;
        }
        callback(root);
        if (root.shadowRoot != null) {
            const shadowChildren = root.shadowRoot.children;
            for (let i = 0; i < shadowChildren.length; i++) {
                this.forEachRelevantElement(shadowChildren[i], callback);
            }
        }
        const children = root.children;
        for (let i = 0; i < children.length; i++) {
            this.forEachRelevantElement(children[i], callback);
        }
    }

    private isElement(node: Node): node is HTMLElement {
        return node.nodeType === ELEMENT_NODE && (node as HTMLElement).style !== undefined;
    }

    private startObserving(): void {
        if (this.target == null) {
            return;
        }
        if (this.observer == null) {
            const observerCtor = this.getMutationObserverCtor();
            if (observerCtor == null) {
                return;
            }
            this.observer = new observerCtor(this.onMutations);
        }
        this.observeTarget();
    }

    private observeTarget(): void {
        this.observer?.observe(this.target!, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['style'],
        });
    }

    private stopObserving(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    // Re-applies spacing to nodes added after toggle-on and to elements whose
    // inline style was overwritten (e.g. by a framework re-render). The observer
    // is paused around our own writes so it never reacts to them.
    private onMutations = (mutations: MutationRecord[]): void => {
        const toForce = new Set<HTMLElement>();
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node =>
                    this.forEachRelevantElement(node, element => toForce.add(element)),
                );
            } else if (
                mutation.type === 'attributes' &&
                this.isElement(mutation.target) &&
                !toolContainerIds.includes(mutation.target.id)
            ) {
                toForce.add(mutation.target);
            }
        }
        if (toForce.size === 0) {
            return;
        }
        this.observer?.disconnect();
        toForce.forEach(element => this.forceSpacing(element));
        this.observeTarget();
    };

    private getMutationObserverCtor(): typeof MutationObserver | null {
        const view = this.target?.ownerDocument?.defaultView;
        if (view != null && typeof view.MutationObserver === 'function') {
            return view.MutationObserver;
        }
        if (typeof MutationObserver === 'function') {
            return MutationObserver;
        }
        return null;
    }

    private getFirstElementTarget(
        document: Document,
        elementResults: HtmlElementAxeResults[],
    ): HTMLElement | null {
        if (!elementResults[0]) {
            return null;
        }

        return TargetHelper.getTargetElement(
            elementResults[0].target,
            document,
            elementResults[0].target.length - 1,
        ) as HTMLElement;
    }
}
