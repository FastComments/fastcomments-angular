import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FastCommentsCommentWidgetConfig} from 'fastcomments-typescript';

enum LoadStatus {
  Started,
  ScriptLoaded,
  Done,
  Error
}

interface FastCommentsState {
  status: LoadStatus;
}

interface WidgetInstance {
  destroy: () => void;
  update: (config: FastCommentsCommentWidgetConfig) => void;
}

@Component({
    selector: 'lib-fastcomments',
    template: `
    <div #fastCommentsElement></div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [],
    standalone: false
})
export class FastCommentsComponent implements OnInit, OnChanges {

  @Input() config!: FastCommentsCommentWidgetConfig;
  @ViewChild('fastCommentsElement', {
    static: true,
  })
  fastCommentsElement!: ElementRef;
  lastWidgetInstance: WidgetInstance | null = null;
  state: FastCommentsState;
  private lastConfigKey: string | null = null;

  constructor() {
    this.state = {
      status: LoadStatus.Started
    };
  }

  ngOnInit() {
    if (!this.config) {
      throw new Error('Configuration is required!Like: <lib-fastcomments [config]="myConfigObject"></lib-fastcomments>' +
        ' or <lib-fastcomments [config]="{ tenantId: \'demo\' }"></lib-fastcomments>');
    }
    if (this.state.status === LoadStatus.ScriptLoaded) {
      return this.reset();
    } else {
      return this.loadInstance();
    }
  }

  ngOnChanges() {
    if ((this.state.status === LoadStatus.ScriptLoaded || this.state.status === LoadStatus.Done) && this.configChanged()) {
      return this.reset();
    }
  }

  private configChanged(): boolean {
    const next = JSON.stringify(this.config ?? {}, (_k, v) => typeof v === 'function' ? undefined : v);
    if (next === this.lastConfigKey) return false;
    this.lastConfigKey = next;
    return true;
  }

  async insertScript(src: string, id: string, parentElement: Element) {
    return new Promise((resolve, reject) => {
      const script = window.document.createElement('script');
      script.async = true;
      script.src = src;
      script.id = id;
      parentElement.appendChild(script);

      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);
    });
  }

  async loadInstance(): Promise<void> {
    switch (this.state.status) {
      case LoadStatus.Started:
        try {
          // @ts-expect-error - FastCommentsUI is injected on window by the embed script
          if (window && !window.FastCommentsUI) {
            const src = this.config.region === 'eu' ? 'https://cdn-eu.fastcomments.com/js/embed-v2.min.js' : 'https://cdn.fastcomments.com/js/embed-v2.min.js';
            await this.insertScript(src, 'fastcomments-widget-script', window.document.body);
          }
          this.state.status = LoadStatus.ScriptLoaded;
          await this.loadInstance();
        } catch (e) {
          console.error('FastComments Script Load Failure', e);
          this.state.status = LoadStatus.Error;
          throw e;
        }
        break;
      case LoadStatus.ScriptLoaded:
        this.instantiateWidget();
        this.state.status = LoadStatus.Done;
        break;
      default:
        break;
    }
  }

  reset() {
    if (!this.config) {
      return;
    }
    if (this.lastWidgetInstance) {
      this.lastWidgetInstance.update(this.config);
    } else {
      this.instantiateWidget();
    }
  }

  instantiateWidget() {
    const element = this.fastCommentsElement.nativeElement;
    if (element) {
      // @ts-expect-error - FastCommentsUI is injected on window by the embed script
      this.lastWidgetInstance = window.FastCommentsUI(element, this.config);
      this.configChanged();
    }
  }

}
