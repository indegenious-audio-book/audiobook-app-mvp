import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { GenreComponent } from "./genre.component";
import { GenreRoutingModule } from "./genre-routing.module";

@NgModule({
  imports: [
    GenreRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [GenreComponent],
  schemas: [
    NO_ERRORS_SCHEMA
]
})
export class GenreModule { }
