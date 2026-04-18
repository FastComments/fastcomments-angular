import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';

export interface FastCommentsReviewsSummaryConfig {
  tenantId: string;
  urlId?: string;
  hasDarkBackground?: boolean;
  region?: 'eu' | string;
  apiHost?: string;
}

type WidgetWindow = { FastCommentsReviewsSummaryWidget?: (el: HTMLElement, cfg: FastCommentsReviewsSummaryConfig) => void };

@Component({
  selector: 'lib-fastcomments-reviews-summary',
  template: `
    <div #fastCommentsElement></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class FastCommentsReviewsSummaryComponent implements OnInit, OnChanges {
  @Input() config!: FastCommentsReviewsSummaryConfig;
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
    if (!w.FastCommentsReviewsSummaryWidget) {
      const src = this.config.region === 'eu'
        ? 'https://cdn-eu.fastcomments.com/js/embed-reviews-summary.min.js'
        : 'https://cdn.fastcomments.com/js/embed-reviews-summary.min.js';
      await this.insertScript(src, 'fastcomments-reviews-summary-script', window.document.body);
    }
    this.loaded = true;
    this.configChanged();
    this.instantiate();
  }

  private instantiate() {
    const w = window as unknown as WidgetWindow;
    const element: HTMLElement | null = this.fastCommentsElement?.nativeElement;
    if (element && w.FastCommentsReviewsSummaryWidget) {
      w.FastCommentsReviewsSummaryWidget(element, this.config);
    }
  }
}
