import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { ResultsComponent } from './components/results/results.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'results-movies/:query/:page', component: ResultsComponent },
  { path: 'results-movies/:query/:page/:year', component: ResultsComponent },
  { path: 'results-shows/:query/:page', component: ResultsComponent },
  { path: 'results-shows/:query/:page/:year', component: ResultsComponent },
  { path: 'movie/:id', component: VideoDetailsComponent },
  { path: 'tv/:id', component: VideoDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
