import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {FastCommentsCommentWidgetConfig} from 'fastcomments-typescript';

enum LoadStatus {
  Started,
  ScriptLoaded,
  Done,
  Error
}

interface FastCommentsState {
  status: LoadStatus;
  widgetId: string | null;
}

interface WidgetInstance {
  destroy: () => void;
  update: (FastCommentsCommentWidgetConfig) => void;
}

@Component({
  selector: 'lib-fastcomments',
  template: `
    <div [id]="state.widgetId"></div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FastCommentsComponent implements OnInit, OnChanges {

  @Input() config: FastCommentsCommentWidgetConfig;
  lastWidgetInstance: WidgetInstance | null;
  state: FastCommentsState;

  constructor() {
    this.state = {
      status: LoadStatus.Started,
      widgetId: `fastcomments-widget-${Math.random()}-${Date.now()}`
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
    if (this.state.status === LoadStatus.ScriptLoaded) {
      return this.reset();
    }
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

  async loadInstance() {
    return new Promise(async (resolve, reject) => {
      switch (this.state.status) {
        case LoadStatus.Started:
          try {
            // @ts-ignore
            if (window && !window.FastCommentsUI) {
              await this.insertScript('https://cdn.fastcomments.com/js/embed.min.js', 'fastcomments-widget-script', window.document.body);
            }
            this.state.status = LoadStatus.ScriptLoaded;
            await this.loadInstance();
            resolve();
          } catch (e) {
            console.error('FastComments Script Load Failure', e);
            this.state.status = LoadStatus.Error;
            reject();
          }
          break;
        case LoadStatus.ScriptLoaded:
          this.instantiateWidget();
          this.state.status = LoadStatus.Done;
          resolve();
          break;
        default:
          resolve();
          break;
      }
    });
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
    if (this.state.widgetId) {
      const element = document.getElementById(this.state.widgetId);
      if (element) {
        // @ts-ignore
        this.lastWidgetInstance = window.FastCommentsUI(element, this.config);
      }
    }
  }

}
