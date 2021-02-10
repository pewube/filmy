import { AppComponent } from './app.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: 'results/:query', component: ResultsComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'tv/:id', component: ShowDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
