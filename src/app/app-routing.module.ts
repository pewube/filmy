import { ResultsMoviesComponent } from './components/results-movies/results-movies.component';
import { AppComponent } from './app.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { ResultsShowsComponent } from './components/results-shows/results-shows.component';

const routes: Routes = [
  { path: 'results-movies/:query/:page', component: ResultsMoviesComponent },
  { path: 'results-shows/:query/:page', component: ResultsShowsComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'tv/:id', component: ShowDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
