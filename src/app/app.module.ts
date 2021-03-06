import { MatPaginatorModule } from '@angular/material/paginator';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultLinkComponent } from './components/result-link/result-link.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { KodiNfoComponent } from './components/kodi-nfo/kodi-nfo.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { ResultsComponent } from './components/results/results.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HomeComponent } from './components/home/home.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RestrictionsContentDialogComponent } from './components/video-details/restrictions-content-dialog/restrictions-content-dialog.component';
import { FullSizePictureComponent } from './components/full-size-picture/full-size-picture.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FullSizeDialogComponent } from './components/full-size-dialog/full-size-dialog.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MinutesToHoursPipe } from './pipes/minutes-to-hours.pipe';
import { PhotoPanelComponent } from './components/photo-panel/photo-panel.component';
import { PersonPanelComponent } from './components/person-panel/person-panel.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { CreditsComponent } from './components/video-details/credits/credits.component';
import { PhotoCollectionComponent } from './components/photo-collection/photo-collection.component';
import { InfoContentDialogComponent } from './info-content-dialog/info-content-dialog.component';
import { ImgLazyDirective } from './directives/img-lazy.directive';

@NgModule({
  declarations: [
    AppComponent,
    ResultLinkComponent,
    FooterComponent,
    KodiNfoComponent,
    VideoDetailsComponent,
    ResultsComponent,
    SearchBarComponent,
    HomeComponent,
    RestrictionsContentDialogComponent,
    FullSizePictureComponent,
    PersonDetailsComponent,
    FullSizeDialogComponent,
    PageNotFoundComponent,
    MinutesToHoursPipe,
    PhotoPanelComponent,
    PersonPanelComponent,
    SpinnerComponent,
    CreditsComponent,
    PhotoCollectionComponent,
    InfoContentDialogComponent,
    ImgLazyDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    ClipboardModule,
    MatTooltipModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
