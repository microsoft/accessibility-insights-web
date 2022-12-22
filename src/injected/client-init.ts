// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

async function initClient() {
    /* 
        The extension can/will often inject code into the target page multiple times as we do not
        currently detect whether code has already been injected prior to any action (scan,
        visualization change, etc). As such, if we see that a window initializer already exists, we
        do nothing.
        
        This also requires the usage of dynamic imports as that prevents any re-loading of code that
        is unnecessary.
    */
    if (window.windowInitializer) {
        return;
    }

    const { Stylesheet } = await import('@fluentui/merge-styles');
    const stylesheet = Stylesheet.getInstance();

    // This *must* be set *before* any transitive import of any other fluentui component!
    //
    // This configuration modifies the prefix that fluentui will use for any styles that it
    // injects dynamically into the target page's global styles. It's important that we use a
    // unique prefix to avoid conflicts with target pages that use fluentui themselves. In some
    // cases, just *importing* fluentui will transitively create conflicting styles, so this needs
    // to be configured before that import happens (see #6212).
    stylesheet.setConfig({
        defaultPrefix: 'insights',
    });

    const { createDefaultLogger } = await import('common/logging/default-logger');
    const { initializeFabricIcons } = await import('../common/fabric-icons');
    const { MainWindowInitializer } = await import('./main-window-initializer');
    const { WindowInitializer } = await import('./window-initializer');

    const logger = createDefaultLogger();
    initializeFabricIcons();

    if (window.top === window) {
        window.windowInitializer = new MainWindowInitializer();
    } else {
        window.windowInitializer = new WindowInitializer();
    }

    window.windowInitializer.initialize(logger).catch(logger.error);
}

void initClient();
