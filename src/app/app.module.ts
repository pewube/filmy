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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ResultsMoviesComponent } from './components/results-movies/results-movies.component';
import { ResultsShowsComponent } from './components/results-shows/results-shows.component';
import { KodiNfoComponent } from './components/kodi-nfo/kodi-nfo.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultLinkComponent,
    FooterComponent,
    ResultsMoviesComponent,
    ResultsShowsComponent,
    KodiNfoComponent,
    VideoDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    ClipboardModule,
    TextFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
