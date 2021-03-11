import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { ResultsComponent } from './components/results/results.component';
import { HomeComponent } from './components/home/home.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'results-movies/:query/:page', component: ResultsComponent },
  { path: 'results-movies/:query/:page/:year', component: ResultsComponent },
  { path: 'results-shows/:query/:page', component: ResultsComponent },
  { path: 'results-shows/:query/:page/:year', component: ResultsComponent },
  { path: 'movie/:id', component: VideoDetailsComponent },
  { path: 'tv/:id', component: VideoDetailsComponent },
  { path: 'person/:id', component: PersonDetailsComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'page-not-found/:error-status', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
