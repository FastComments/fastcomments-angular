import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FastCommentsLiveChatWidgetConfig} from 'fastcomments-typescript';

interface WidgetInstance {
  destroy: () => void;
  update: (cfg: FastCommentsLiveChatWidgetConfig) => void;
}

type WidgetWindow = { FastCommentsLiveChat?: (el: HTMLElement, cfg: FastCommentsLiveChatWidgetConfig) => WidgetInstance };

@Component({
  selector: 'lib-fastcomments-live-chat',
  template: `
    <div #fastCommentsElement></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class FastCommentsLiveChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: FastCommentsLiveChatWidgetConfig;
  @ViewChild('fastCommentsElement', {static: true}) fastCommentsElement!: ElementRef;
  private instance: WidgetInstance | null = null;
  private loaded = false;
  private lastConfigKey: string | null = null;

  async ngOnInit() {
    if (!this.config) {
      throw new Error('Configuration is required!');
    }
    await this.load();
  }

  ngOnChanges() {
    if (this.loaded && this.instance && this.configChanged()) {
      this.instance.update(this.config);
    }
  }

  private configChanged(): boolean {
    const next = JSON.stringify(this.config ?? {});
    if (next === this.lastConfigKey) return false;
    this.lastConfigKey = next;
    return true;
  }

  ngOnDestroy() {
    this.instance?.destroy();
    this.instance = null;
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
    if (!w.FastCommentsLiveChat) {
      const src = this.config.region === 'eu'
        ? 'https://cdn-eu.fastcomments.com/js/embed-live-chat.min.js'
        : 'https://cdn.fastcomments.com/js/embed-live-chat.min.js';
      await this.insertScript(src, 'fastcomments-live-chat-script', window.document.body);
    }
    this.loaded = true;
    this.configChanged();
    this.instantiate();
  }

  private instantiate() {
    const w = window as unknown as WidgetWindow;
    const element: HTMLElement | null = this.fastCommentsElement?.nativeElement;
    if (element && w.FastCommentsLiveChat) {
      this.instance = w.FastCommentsLiveChat(element, this.config);
    }
  }
}
