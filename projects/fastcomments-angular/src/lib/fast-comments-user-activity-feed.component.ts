import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';

export interface FastCommentsUserActivityFeedConfig {
  tenantId: string;
  userId: string;
  hasDarkBackground?: boolean;
  readonly?: boolean;
  region?: 'eu' | string;
  apiHost?: string;
}

type WidgetWindow = { FastCommentsUserActivity?: (el: HTMLElement, cfg: FastCommentsUserActivityFeedConfig, cb?: (err: Error | null) => void) => void };

@Component({
  selector: 'lib-fastcomments-user-activity-feed',
  template: `
    <div #fastCommentsElement></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class FastCommentsUserActivityFeedComponent implements OnInit, OnChanges {
  @Input() config!: FastCommentsUserActivityFeedConfig;
  @ViewChild('fastCommentsElement', {static: true}) fastCommentsElement!: ElementRef;
  private loaded = false;
  private lastConfigKey: string | null = null;

  async ngOnInit() {
    if (!this.config) {
      throw new Error('Configuration is required!');
    }
    await this.load();
  }

  async ngOnChanges() {
    if (this.loaded && this.configChanged()) {
      this.instantiate();
    }
  }

  private configChanged(): boolean {
    const next = JSON.stringify(this.config ?? {});
    if (next === this.lastConfigKey) return false;
    this.lastConfigKey = next;
    return true;
  }

  private async insertScript(src: string, id: string, parentElement: Element): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) { resolve(); return; }
      const script = window.document.createElement('script');
      script.async = true;
      script.src = src;
      script.id = id;
      parentElement.appendChild(script);
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject());
    });
  }

  private async load() {
    const w = window as unknown as WidgetWindow;
    if (!w.FastCommentsUserActivity) {
      const src = this.config.region === 'eu'
        ? 'https://cdn-eu.fastcomments.com/js/embed-user-activity.min.js'
        : 'https://cdn.fastcomments.com/js/embed-user-activity.min.js';
      await this.insertScript(src, 'fastcomments-user-activity-script', window.document.body);
    }
    this.loaded = true;
    this.configChanged();
    this.instantiate();
  }

  private instantiate() {
    const w = window as unknown as WidgetWindow;
    const element: HTMLElement | null = this.fastCommentsElement?.nativeElement;
    if (element && w.FastCommentsUserActivity) {
      w.FastCommentsUserActivity(element, this.config);
    }
  }
}
