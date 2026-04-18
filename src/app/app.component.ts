import { Component, OnInit } from '@angular/core';
import { FastCommentsCommentWidgetConfig } from 'fastcomments-typescript';

type ExampleKey = 'comments' | 'comment-count' | 'live-chat' | 'recent-comments' | 'recent-discussions' | 'top-pages'
  | 'reviews-summary' | 'user-activity-feed'
  | 'callbacks' | 'dark' | 'eu' | 'paginated' | 'simple-sso' | 'secure-sso';
type Theme = 'light' | 'dark';
type LogEvent = { id: number; name: string; payload: string; at: string };
type SSOStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ExampleMeta {
  key: ExampleKey;
  label: string;
  kind: 'widget' | 'flow';
  hint: string;
}

const THEME_KEY = 'fc-showcase-theme';
const USER_SET_KEY = THEME_KEY + ':user-set';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'FastComments Angular Showcase';

  examples: ExampleMeta[] = [
    { key: 'comments',          label: 'Live Comment Widget', kind: 'widget', hint: 'Full live commenting widget' },
    { key: 'comment-count',     label: 'Comment Count',       kind: 'widget', hint: 'Inline count badge' },
    { key: 'live-chat',         label: 'Live Chat',           kind: 'widget', hint: 'Realtime streaming chat' },
    { key: 'recent-comments',   label: 'Recent Comments',     kind: 'widget', hint: 'Cross-site comment stream' },
    { key: 'recent-discussions',label: 'Recent Discussions',  kind: 'widget', hint: 'Most active threads' },
    { key: 'top-pages',         label: 'Top Pages',           kind: 'widget', hint: 'Pages ranked by activity' },
    { key: 'reviews-summary',   label: 'Reviews Summary',     kind: 'widget', hint: 'Star ratings overview' },
    { key: 'user-activity-feed',label: 'Activity Feed',       kind: 'widget', hint: 'Per-user timeline' },
    { key: 'callbacks',         label: 'Event Callbacks',     kind: 'flow',   hint: 'Lifecycle events mirrored live' },
    { key: 'dark',              label: 'Dark Mode',           kind: 'flow',   hint: 'Runtime theme switching' },
    { key: 'eu',                label: 'EU Region',           kind: 'flow',   hint: 'Data residency via region flag' },
    { key: 'paginated',         label: 'Thread Pagination',   kind: 'flow',   hint: 'Swap urlId at runtime' },
    { key: 'simple-sso',        label: 'Simple SSO',          kind: 'flow',   hint: 'Unsigned identity' },
    { key: 'secure-sso',        label: 'Secure SSO',          kind: 'flow',   hint: 'HMAC-signed identity' }
  ];

  selected: ExampleKey = 'comments';
  theme: Theme = this.detectTheme();
  localDark = this.theme === 'dark';

  private detectTheme(): Theme {
    if (typeof document === 'undefined' || typeof window === 'undefined') return 'light';
    const fromAttr = document.documentElement.getAttribute('data-fc-theme');
    if (fromAttr === 'light' || fromAttr === 'dark') return fromAttr;
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  ngOnInit() {
    this.applyTheme(this.theme);

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
      mq?.addEventListener?.('change', (e) => {
        if (!window.localStorage.getItem(USER_SET_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  private applyTheme(next: Theme) {
    this.theme = next;
    if (typeof document !== 'undefined') document.documentElement.dataset['fcTheme'] = next;
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next);
  }

  setTheme(next: Theme) {
    if (typeof window !== 'undefined') window.localStorage.setItem(USER_SET_KEY, '1');
    this.applyTheme(next);
  }

  get isDark() { return this.theme === 'dark'; }
  get widgets() { return this.examples.filter(e => e.kind === 'widget'); }
  get flows()   { return this.examples.filter(e => e.kind === 'flow'); }
  get current() { return this.examples.find(e => e.key === this.selected) ?? this.examples[0]; }

  events: LogEvent[] = [];
  private eventSeq = 0;
  productId = 0;
  secureSSOStatus: SSOStatus = 'idle';
  secureSSO: { loginURL: string; logoutURL: string; userDataJSONBase64?: string; verificationHash?: string; timestamp?: number } = {
    loginURL: 'https://example.com/login',
    logoutURL: 'https://example.com/logout'
  };

  private track(name: string, payload: unknown) {
    const pretty = typeof payload === 'string' ? payload : JSON.stringify(payload).slice(0, 220);
    this.events = [{ id: ++this.eventSeq, name, payload: pretty, at: new Date().toLocaleTimeString() }, ...this.events].slice(0, 40);
    console.log(`Callback: ${name}`, payload);
  }

  clearEvents() { this.events = []; }
  paginate(dir: -1 | 1) { this.productId += dir; }

  private async loadSecureSSO() {
    if (this.secureSSOStatus !== 'idle') return;
    this.secureSSOStatus = 'loading';
    try {
      const res = await fetch('http://localhost:3003/sso-user-info', { headers: { Accept: 'application/json' } });
      const info = await res.json();
      this.secureSSO = { ...this.secureSSO, ...info };
      this.secureSSOStatus = 'ready';
    } catch {
      this.secureSSOStatus = 'error';
    }
  }

  get baseConfig(): FastCommentsCommentWidgetConfig {
    return { tenantId: 'demo', hasDarkBackground: this.isDark };
  }

  get commentCountConfig() {
    return { tenantId: 'demo', urlId: 'angular-demo-count', hasDarkBackground: this.isDark };
  }

  get liveChatConfig() {
    return { tenantId: 'demo', urlId: 'angular-demo-live-chat', hasDarkBackground: this.isDark };
  }

  get reviewsSummaryConfig() {
    return { tenantId: 'demo', urlId: 'demo-ratings', hasDarkBackground: this.isDark };
  }

  get userActivityFeedConfig() {
    return { tenantId: 'demo', userId: 'demo:someone@somewhere.com', hasDarkBackground: this.isDark };
  }

  get darkConfig(): FastCommentsCommentWidgetConfig {
    return { tenantId: 'demo', hasDarkBackground: this.localDark };
  }

  get callbacksConfig(): FastCommentsCommentWidgetConfig {
    return {
      tenantId: 'demo',
      urlId: 'angular-demo-callbacks',
      hasDarkBackground: this.isDark,
      onInit: () => this.track('onInit', ''),
      onRender: () => this.track('onRender', ''),
      onCommentsRendered: (comments: unknown[]) => this.track('onCommentsRendered', `${comments.length} comments`),
      commentCountUpdated: (count: number) => this.track('commentCountUpdated', `count=${count}`),
      onAuthenticationChange: (event: string, data: unknown) => this.track('onAuthenticationChange', { event, data }),
      onReplySuccess: (comment: unknown) => this.track('onReplySuccess', comment),
      onVoteSuccess: (_c: unknown, voteId: string, direction: 'up' | 'down' | 'deleted', status: 'success' | 'pending-verification') => this.track('onVoteSuccess', { voteId, direction, status }),
      onCommentSubmitStart: (c: unknown, next: () => void) => { this.track('onCommentSubmitStart', c); next(); }
    } as FastCommentsCommentWidgetConfig;
  }

  get euConfig(): FastCommentsCommentWidgetConfig {
    return { tenantId: 'demo', region: 'eu', urlId: 'angular-demo-eu', hasDarkBackground: this.isDark };
  }

  get paginatedConfig(): FastCommentsCommentWidgetConfig {
    return { tenantId: 'demo', urlId: `angular-product-${this.productId}`, hasDarkBackground: this.isDark };
  }

  get simpleSSOConfig(): FastCommentsCommentWidgetConfig {
    return {
      tenantId: 'demo',
      urlId: 'angular-demo-simple-sso',
      hasDarkBackground: this.isDark,
      simpleSSO: {
        username: 'Someone',
        email: 'someone@somewhere.com',
        avatar: 'https://staticm.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        websiteUrl: 'https://blog.fastcomments.com'
      }
    };
  }

  get secureSSOConfig(): FastCommentsCommentWidgetConfig {
    return {
      tenantId: 'demo',
      urlId: 'angular-demo-secure-sso',
      hasDarkBackground: this.isDark,
      sso: this.secureSSO
    };
  }

  snippets: Record<ExampleKey, { label: string; code: string }> = {
    comments: {
      label: 'app.component.ts',
      code: `import { Component } from '@angular/core';
import { FastCommentsCommentWidgetConfig } from 'fastcomments-typescript';

@Component({
  selector: 'app-root',
  template: \`<lib-fastcomments [config]="config"></lib-fastcomments>\`
})
export class AppComponent {
  config: FastCommentsCommentWidgetConfig = { tenantId: 'demo' };
}`,
    },
    'comment-count': {
      label: 'comment-count.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-comment-count',
  template: \`<lib-fastcomments-comment-count [config]="config"></lib-fastcomments-comment-count>\`
})
export class CommentCountComponent {
  config = { tenantId: 'demo', urlId: 'my-page' };
}`,
    },
    'live-chat': {
      label: 'live-chat.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-live-chat',
  template: \`<lib-fastcomments-live-chat [config]="config"></lib-fastcomments-live-chat>\`
})
export class LiveChatComponent {
  config = { tenantId: 'demo', urlId: 'my-stream' };
}`,
    },
    'recent-comments': {
      label: 'recent-comments.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-comments',
  template: \`<lib-fastcomments-recent-comments [config]="config"></lib-fastcomments-recent-comments>\`
})
export class RecentCommentsComponent {
  config = { tenantId: 'demo' };
}`,
    },
    'recent-discussions': {
      label: 'recent-discussions.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-discussions',
  template: \`<lib-fastcomments-recent-discussions [config]="config"></lib-fastcomments-recent-discussions>\`
})
export class RecentDiscussionsComponent {
  config = { tenantId: 'demo' };
}`,
    },
    'top-pages': {
      label: 'top-pages.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-top-pages',
  template: \`<lib-fastcomments-top-pages [config]="config"></lib-fastcomments-top-pages>\`
})
export class TopPagesComponent {
  config = { tenantId: 'demo' };
}`,
    },
    'reviews-summary': {
      label: 'reviews-summary.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews-summary',
  template: \`<lib-fastcomments-reviews-summary [config]="config"></lib-fastcomments-reviews-summary>\`
})
export class ReviewsSummaryComponent {
  config = { tenantId: 'demo', urlId: 'demo-ratings' };
}`,
    },
    'user-activity-feed': {
      label: 'user-activity-feed.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-activity-feed',
  template: \`<lib-fastcomments-user-activity-feed [config]="config"></lib-fastcomments-user-activity-feed>\`
})
export class UserActivityFeedComponent {
  // SSO userId format: \\\`\\\${tenantId}:\\\${appUserId}\\\`
  config = { tenantId: 'demo', userId: 'demo:someone@somewhere.com' };
}`,
    },
    callbacks: {
      label: 'callbacks.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-callbacks',
  template: \`<lib-fastcomments [config]="config"></lib-fastcomments>\`
})
export class CallbacksComponent {
  config = {
    tenantId: 'demo',
    urlId: 'callbacks-demo',
    onInit: () => console.log('onInit'),
    onRender: () => console.log('onRender'),
    onCommentsRendered: (c) => console.log('rendered', c.length),
    commentCountUpdated: (n) => console.log('count', n),
    onAuthenticationChange: (e, d) => console.log(e, d),
    onReplySuccess: (c) => console.log('reply', c),
    onVoteSuccess: (c, id, dir) => console.log('vote', dir),
    onCommentSubmitStart: (c, next) => next()
  };
}`,
    },
    dark: {
      label: 'dark-mode.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-dark-mode',
  template: \`
    <button (click)="setDark(false)">Light</button>
    <button (click)="setDark(true)">Dark</button>
    <lib-fastcomments [config]="config"></lib-fastcomments>
  \`
})
export class DarkModeComponent {
  isDark = false;
  get config() {
    return { tenantId: 'demo', hasDarkBackground: this.isDark };
  }
  setDark(next: boolean) { this.isDark = next; }
}`,
    },
    eu: {
      label: 'eu.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-eu',
  template: \`<lib-fastcomments [config]="config"></lib-fastcomments>\`
})
export class EuComponent {
  config = { tenantId: 'demo', region: 'eu', urlId: 'demo-eu' };
}`,
    },
    paginated: {
      label: 'paginated.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-paginated',
  template: \`
    <button (click)="paginate(-1)">Prev</button>
    <button (click)="paginate(1)">Next</button>
    <lib-fastcomments [config]="config"></lib-fastcomments>
  \`
})
export class PaginatedComponent {
  productId = 0;
  get config() {
    return { tenantId: 'demo', urlId: \`product-\${this.productId}\` };
  }
  paginate(dir: number) { this.productId += dir; }
}`,
    },
    'simple-sso': {
      label: 'simple-sso.component.ts',
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-sso',
  template: \`<lib-fastcomments [config]="config"></lib-fastcomments>\`
})
export class SimpleSsoComponent {
  config = {
    tenantId: 'demo',
    urlId: 'demo-simple-sso',
    simpleSSO: {
      username: 'Someone',
      email: 'someone@somewhere.com',
      avatar: 'https://example.com/avatar.jpg'
    }
  };
}`,
    },
    'secure-sso': {
      label: 'secure-sso.component.ts',
      code: `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-secure-sso',
  template: \`<lib-fastcomments [config]="config"></lib-fastcomments>\`
})
export class SecureSsoComponent implements OnInit {
  sso: any = { loginURL: 'https://example.com/login', logoutURL: 'https://example.com/logout' };
  get config() {
    return { tenantId: 'demo', urlId: 'demo-secure-sso', sso: this.sso };
  }
  async ngOnInit() {
    // Your server HMAC-signs a base64 user payload
    const r = await fetch('/sso-user-info');
    const info = await r.json();
    this.sso = { ...this.sso, ...info };
  }
}`,
    }
  };

  get currentSnippet() { return this.snippets[this.selected]; }

  copied = false;
  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.currentSnippet.code);
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 1200);
    } catch (_) {}
  }

  select(key: ExampleKey) {
    this.selected = key;
    if (key === 'secure-sso') this.loadSecureSSO();
  }

  setDark(next: boolean) {
    this.localDark = next;
  }
}
