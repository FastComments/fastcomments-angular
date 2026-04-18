import { NgModule } from '@angular/core';
import { FastCommentsComponent } from './fast-comments.component';
import { FastCommentsCommentCountComponent } from './fast-comments-comment-count.component';
import { FastCommentsLiveChatComponent } from './fast-comments-live-chat.component';
import { FastCommentsRecentCommentsComponent } from './fast-comments-recent-comments.component';
import { FastCommentsRecentDiscussionsComponent } from './fast-comments-recent-discussions.component';
import { FastCommentsReviewsSummaryComponent } from './fast-comments-reviews-summary.component';
import { FastCommentsTopPagesComponent } from './fast-comments-top-pages.component';
import { FastCommentsUserActivityFeedComponent } from './fast-comments-user-activity-feed.component';



@NgModule({
  declarations: [
    FastCommentsComponent,
    FastCommentsCommentCountComponent,
    FastCommentsLiveChatComponent,
    FastCommentsRecentCommentsComponent,
    FastCommentsRecentDiscussionsComponent,
    FastCommentsReviewsSummaryComponent,
    FastCommentsTopPagesComponent,
    FastCommentsUserActivityFeedComponent,
  ],
  imports: [
  ],
  exports: [
    FastCommentsComponent,
    FastCommentsCommentCountComponent,
    FastCommentsLiveChatComponent,
    FastCommentsRecentCommentsComponent,
    FastCommentsRecentDiscussionsComponent,
    FastCommentsReviewsSummaryComponent,
    FastCommentsTopPagesComponent,
    FastCommentsUserActivityFeedComponent,
  ]
})
export class FastCommentsModule { }
