import { Component } from '@angular/core';
import {FastCommentsCommentWidgetConfig} from "fastcomments-typescript";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'fastcomments-angular-workspace';
  config: FastCommentsCommentWidgetConfig = {
    tenantId: 'demo',
  };
}
