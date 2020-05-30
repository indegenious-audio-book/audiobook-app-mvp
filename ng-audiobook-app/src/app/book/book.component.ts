import { Component, OnInit } from "@angular/core";
import { BookService } from "./book.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from "@angular/router";
import { Book, BookEntity } from "../data/book.model";
import { startWith } from "rxjs/operators";

interface BookSkeleton{
    skeleton: boolean;
}

const SKELETONS: Array<BookSkeleton>  = [
    { skeleton: true },
    { skeleton: true },
    { skeleton: true }
    // since this is for a listView I have quite a few of these
];

@Component({
    selector: "ns-book",
    templateUrl: "./book.component.html",
    styleUrls: ["./book.component.css"]
})
export class BookComponent implements OnInit {
    genreId: any;
    books: Array<BookEntity> | Array<[]>;
    // tslint:disable-next-line:max-line-length
    constructor(private bookService: BookService, private router: RouterExtensions, private page: Page, private routeParams: ActivatedRoute) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.routeParams.params
            .forEach((params) => { this.genreId = +params.id; });
        // this.routeParams.queryParams.subscribe((params) => {
        //     this.genreId = params["id"];
        //     console.log(this.genreId);
        // });
        console.log(`book: ${this.genreId}`);
        this.bookService.getBooksByGenre(this.genreId)
            .subscribe((res: Book) => {
                console.log(res.results);
                this.books = res.results;
            }, (err) => {
                console.log(err);
            });

        console.log("Book List" + this.books);
    }

    playBookByBookId(bookId: number) {
        console.log(bookId);
        this.router.navigate(["browse", {BookSelected: bookId }]);
    }
    
    templateSelector(item: any, index: number, items: Array<any>) {
        return "template";
    };

}
