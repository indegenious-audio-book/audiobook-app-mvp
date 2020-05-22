import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BookComponent } from "./book.component";
import { BookRoutingModule } from "./book-routing.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        BookRoutingModule
    ],
    declarations: [BookComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BookModule { }
