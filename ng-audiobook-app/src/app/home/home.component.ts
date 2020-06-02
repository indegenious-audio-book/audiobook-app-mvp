import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { HomeService } from "./home.service";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import { screen } from "tns-core-modules/platform";
import { GenreService } from "../genre/genre.service";
import { BookService } from "../book/book.service";
// import { GenreEntity, Genre } from "../data/genre.model";
import { BookEntity, Book } from "../data/book.model";
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    viewHeigth: number = 0;
    // genres: Array<GenreEntity> = [];
    books: Array<BookEntity> = [];
    latestBooks: Array<BookEntity> = [];
    latestBooks1: BookEntity;
    latestBooks2: BookEntity;
    latestBooks3: BookEntity;
    imageUri1: string;

    constructor(private bookService: BookService, private router: RouterExtensions, private page: Page) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.actionBarHidden = true;

        this.viewHeigth = screen.mainScreen.heightDIPs * 0.6;

        // this.genreService.getGenreList()
        //     .subscribe((res: Genre) => {
        //         console.log(res.results);
        //         this.genres = res.results;
        //     }, (err) => {
        //         console.log(err);
        //     });
        // console.log("Genre List" + this.genres);

        // this.bookService.getBookHomeView()
        //     .subscribe((res: Book) => {
        //         this.books = res.results;
        //     }, (err) => {
        //         console.log(err);
        //     });
        // console.log("Book list" + this.books);

        this.bookService.getLatestBooks()
            .subscribe((res: Book) => {
                this.latestBooks = res.results;
                this.latestBooks1 = this.latestBooks[0];

                this.latestBooks2 = this.latestBooks[1];
                this.latestBooks3 = this.latestBooks[2];
                const thumbnail_url: string = this.latestBooks1.thumbnail_url;
                console.log(`image uri`, thumbnail_url);
                this.imageUri1 = "http://34.93.249.161:9000/thumbnails/" + thumbnail_url ;
                console.log("latest Book list" + this.latestBooks);
                console.log(`res results ${res.results}`);
                console.log(res);
                console.log(`latest book output ${this.latestBooks}`);
            }, (err) => {
                console.log(err);
            });
        
    }

    goToArtist() {
        this.router.navigate(["artist"]);
    }

    goToPlayer() {
        this.router.navigate(["player"]);
    }
    gotolist() {
        this.router.navigate(["browse"]);
    }
    GetBookByGenre(genreId: number){
        console.log("nbn");
        console.log(genreId);
        this.router.navigate(["book", {id: genreId }]);
    }
}
