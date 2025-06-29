import type { Routes } from "@angular/router"
import { AppComponent } from "./app.component"

export const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "client", component: AppComponent },
  { path: "admin", component: AppComponent },
  { path: "admin/:page", component: AppComponent },
  { path: "**", redirectTo: "" },
]
