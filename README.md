# fastcomments-angular

## AI coding agents

[![skills.sh](https://skills.sh/b/fastcomments/skills)](https://skills.sh/fastcomments/skills)

Give your coding agent the FastComments context it needs - widgets, configuration, Secure SSO, the REST API, and the SDKs:

```bash
npx skills add fastcomments/skills
```

Works with Claude Code, Codex, Cursor, Copilot, Gemini, and every other agent the [skills CLI](https://github.com/vercel-labs/skills) supports.

## Live Demo

Try every widget live at <https://fastcomments.com/commenting-system-for-angular/>.

## Installation

[![npm](https://img.shields.io/npm/v/ngx-fastcomments?logo=npm&label=npm&color=cb3837)](https://www.npmjs.com/package/ngx-fastcomments)

```bash
npm install fastcomments-typescript --save
npm install ngx-fastcomments --save
```

See the [ngx-fastcomments README](/projects/fastcomments-angular) for usage.

## Project Structure

This is the root workspace for fastcomments-angular.

In "src" you will find an application which is simply a demo app to test the libraries.

In "projects" you will find the fastcomments library.

View the README for ngx-fastcomments [here](/projects/fastcomments-angular)

## Development server

Run `npm run start-demo` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Maintenance Status

These components are wrappers around our core VanillaJS components. We can automatically update these components (fix bugs, add features) without publishing this library, so while it may not be published for a while that does not mean FastComments is not under active development! Feel free to check [our blog](https://blog.fastcomments.com/) for updates. Breaking API changes or features will never be shipped to the underlying core library without a version bump in this library.
