import { ResultsMoviesComponent } from './components/results-movies/results-movies.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsShowsComponent } from './components/results-shows/results-shows.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';

const routes: Routes = [
  { path: 'results-movies/:query/:page', component: ResultsMoviesComponent },
  { path: 'results-shows/:query/:page', component: ResultsShowsComponent },
  { path: 'movie/:id', component: VideoDetailsComponent },
  { path: 'tv/:id', component: VideoDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
