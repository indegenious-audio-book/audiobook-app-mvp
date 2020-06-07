import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { AuthorComponent } from "./author.component";
import { AuthorRoutingModule } from "./author-routing.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AuthorRoutingModule
    ],
    declarations: [AuthorComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AuthorModule { }
