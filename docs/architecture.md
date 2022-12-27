<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Accessibility Insights Extension Architecture

This document describes the top level architecture for the Accessibility Insights extension. It was written after completing the transition from Chrome's [manifest v2](https://developer.chrome.com/docs/extensions/mv2/) to [manifest v3](https://developer.chrome.com/docs/extensions/mv3/), and as a result it highlights the changes made during that transition.

### Extension Contexts

At a top level, the extension has 4 main pages/operating contexts. These separate environments behave like a single flux application, as described [in the flux section](#flux).

In addition to these 4 main pages, the extension has 2 additional contexts targeted towards developers debugging the application, those being DevTools and DebugTools. 

#### Details View

A tab/page that is managed by the extension and utilized when we surface detailed results or information to the user. This view is linked to a specific target page through a tab id reference.

![Screenshot of details view](./screenshots/details-view.png)

#### Target Page

This is the page being tested by the extension. The extension injects content scripts into the target page to do things like run axe-core to gather test results and display visualizations.

![Screenshot of target page with visualizations](./screenshots/target-page.png)

#### Popup

The page/javascript thread that is opened when the extension is activated.

![Screenshot of popup](./screenshots/popup.png)

#### Background/Service Worker

A javascript thread that runs for the extension outside of the scope of any specific tab. With manifest v2, this thread was called a [background page or background script](https://developer.chrome.com/docs/extensions/mv2/background_pages/). It was persistent, always available, and considered the singular 'source of truth' for the whole system. With manifest v3, background pages were replaced by [service workers](https://developer.chrome.com/docs/workbox/service-worker-overview/), the main difference being that service workers have finite lifetimes and shut down once the extension goes idle after a certain timeout. Importantly, both background pages and service workers only have single instances and have a 1:many relationship with tab contexts they manage.

During the transition from manifest v2 to v3, the background script was migrated to be run as a service worker. As a result, many of the uses of `background` in the code/file names in this repo are analogous with `service worker` for the mv3 extension.

### Flux

The separate extension contexts communicate via [message passing](https://developer.chrome.com/docs/extensions/mv3/messaging/) with the intention to behave as a singular [flux](https://facebook.github.io/flux/docs/in-depth-overview/) application. At a high level, the flux pattern ensures that data flows in one direction, from an action to a dispatcher (or action creator) to a store and finally to a view (see [flux documentation](https://facebook.github.io/flux/docs/in-depth-overview/#structure-and-data-flow) for more details).

In this repo, message-creators, contained in [the message-creators directory](../src/common/message-creators), use messages to emulate actions. These messages are sent to the background/service worker where they are [distributed](../src/background/background-message-distributor.ts) to the specified context (i.e. a context for the specified tab or depending on the action, the global context). From there, the [interpreter](../src/background/interpreter.ts) will map the  message to an action-creator responsible for invoking the appropriate actions and thus causing stores to update. Once a store is updated, we broadcast the new state to other contexts (i.e. popup, details view, etc.) where a [store-proxy](../src/common/store-proxy.ts), emulating the respective store which was updated, receives the update and is used to populate the view. You can find the top level action interfaces/logic in [the flux directory](../src/common/flux) and stores in [the stores directory](../src/background/stores).

Prior to manifest v3 changes, most of the flux actions were fire-and-forget, meaning we treated all action listeners as synchronous, even if they kicked off async work, as seen with the [sync-action class](../src/common/flux/sync-action.ts). This was fine with manifest v2's persistent background pages, but became a problem with manifest v3 service workers. Since service workers can be shut down when the browser thinks they have gone idle, it is important to track any outstanding work in the form of promises so that the browser is aware when there are unsettled promises still in progress and does not shut the service worker down prematurely. As a result, we switched any actions whose listeners kick off async work to be  [async-actions](../src/common/flux/async-action.ts). With this change, we are able to track outstanding work via promises, ensuring that the service worker stays active until all promises are settled.

### Storage

With manifest v3, stores are maintained in the service worker. To ensure that data is not lost on service worker shut down and restart, the extension backs up necessary data in the browser's [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), a persistent storage system. The logic for persisting and updating store data can be found in the [persistent-store class](../src/common/flux/persistent-store.ts) and the logic for fetching data on service worker start up can be found in [get-persisted-data](../src/background/get-persisted-data.ts). In addition to any stores that inherit from the persistent-store class, the data stored in the IndexedDB includes a few data structures containing metadata about the state of the extension in case the service worker is shut down while testing is still in progress.

**Note**: Because store data is persisted in the browser across extension runs/updates, it is important to consider backwards compatibility when updating any data structures in the [store-data directory](../src/common/types/store-data).
