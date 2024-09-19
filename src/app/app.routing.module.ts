import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';


const routes: Routes = [
  { path: 'category/:name', component: CategoryDetailsComponent }, // Dynamic route for categories
  { path: '', redirectTo: '/category/javascript', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/category/javascript' }, // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
