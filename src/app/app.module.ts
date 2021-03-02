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
import { KodiNfoComponent } from './components/kodi-nfo/kodi-nfo.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { ResultsComponent } from './components/results/results.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HomeComponent } from './components/home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NfoContentDialogComponent } from './components/kodi-nfo/nfo-content-dialog/nfo-content-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    NfoContentDialogComponent,
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
    MatExpansionModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NfoContentDialogComponent],
})
export class AppModule {}
