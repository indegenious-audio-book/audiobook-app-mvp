import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { HomeService } from "./home.service";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { EventData } from "tns-core-modules/ui/page/page";
import { Book, BookEntity } from "./home.model";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    countries: Array<any> = [];
    bookList: Array<BookEntity> = [];
    mockedDataArray: any = [
        { name: "India", continent: "Asia" },
        { name: "United States", continent: "America" },
        { name: "Australa", continent: "Australia" },
        { name: "Japan", continent: "Asia" }
    ];
    constructor(private homeService: HomeService) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.

        for (let index = 0; index < this.mockedDataArray.length; index++) {
            // creating an object with additional id key to re-use as unique id
            this.countries.push({ data: this.mockedDataArray[index], id: index });
        }

        this.homeService.getBookGallery()
            .subscribe((res: Book) => {
                console.log(res.results);
                this.bookList = res.results;
            }, (err) => {
                console.log(err);
            });
        console.log("New List" + this.bookList);
    }

    onTap(args: EventData) {
        // using the unique id assigned via the view-model
        console.log(args.object.get("id"));
    }

    onScroll(args: ScrollEventData) {
        console.log("scrollX: " + args.scrollX + "; scrollY: " + args.scrollY);
    }

    onScrollLoaded(args) {
        // scroll to specific position of the horizontal scroll list
        const scrollOffset = 330;
        (<ScrollView>args.object).scrollToHorizontalOffset(scrollOffset, true);
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
