import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: 'results-movies/:query/:page', component: ResultsComponent },
  { path: 'results-shows/:query/:page', component: ResultsComponent },
  { path: 'movie/:id', component: VideoDetailsComponent },
  { path: 'tv/:id', component: VideoDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
