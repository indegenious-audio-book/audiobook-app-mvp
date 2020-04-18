import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { HomeService } from "./home.service";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { Book, BookEntity } from "./home.model";
import { RouterExtensions } from "nativescript-angular/router";
import { screen } from "tns-core-modules/platform";
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    viewHeigth: number = 0;
    bookList: Array<BookEntity> = [];

    constructor(private homeService: HomeService, private router: RouterExtensions, private page: Page) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.actionBarHidden = true;
        this.viewHeigth = screen.mainScreen.heightDIPs * 0.6;

        this.homeService.getBookGallery()
            .subscribe((res: Book) => {
                console.log(res.results);
                this.bookList = res.results;
            }, (err) => {
                console.log(err);
            });
        console.log("New List" + this.bookList);
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
}
