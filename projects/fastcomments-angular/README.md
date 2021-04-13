# ngx-fastcomments

This is an Angular library for FastComments, a live embedded commenting library.

To get started, we pass a config object for the demo tenant:

    <lib-fastcomments [config]="{ tenantId: 'demo' }"></lib-fastcomments>

Replace this with your own tenant ID, like so:

    <lib-fastcomments [config]="{ tenantId: 'abc123' }"></lib-fastcomments>

Since the configuration can get quite complicated, we can pass in an object reference:

    <lib-fastcomments [config]="fastcommentsConfig"></lib-fastcomments>

The widget uses change detection, so changing any properties of the configuration object will cause it to be reloaded.

This allows support for things like toggling dark mode, or pagination, simply by changing the configuration.

All configuration [in our docs](https://docs.fastcomments.com/guide-customizations-and-configuration.html) is supported. You can find
the TypeScript definitions for the configuration [on GitHub](https://github.com/FastComments/fastcomments-typescript/blob/main/src/fast-comments-comment-widget-config.ts#L25).
