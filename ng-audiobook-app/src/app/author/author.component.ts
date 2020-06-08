import { Component, OnInit } from "@angular/core";
import { AuthorService } from "./author.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from "@angular/router";
import { Author, AuthorEntity } from "../data/author.model";
import { startWith } from "rxjs/operators";

interface AuthorSkeleton{
    skeleton: boolean;
}

const SKELETONS: Array<AuthorSkeleton>  = [
    { skeleton: true },
    { skeleton: true },
    { skeleton: true }
    // since this is for a listView I have quite a few of these
];

@Component({
    selector: "ns-authors",
    templateUrl: "./author.component.html",
    styleUrls: ["./author.component.css"]
})
export class AuthorComponent implements OnInit {
    genreId: any;
    authors: Array<AuthorEntity> | Array<[]>;

    // tslint:disable-next-line:max-line-length
    constructor(private authorService: AuthorService, private router: RouterExtensions, private page: Page, private routeParams: ActivatedRoute) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.routeParams.params
            .forEach((params) => { this.genreId = +params.id; });
        console.log(`authors: ${this.genreId}`);
        this.authorService.getAuthorsList()
            .subscribe((res: Author) => {
                console.log(res.results);
                this.authors = res.results;
            }, (err) => {
                console.log(err);
            });

        console.log("Author List" + this.authors);
    }

    getAuthorsImages(authorName: string) {
        console.log(authorName);
        authorName = authorName.trim();
        authorName = authorName.toLowerCase();
        authorName = authorName.replace(" ", "_");
        const imageUri = "http://34.93.249.161:9000/authors/" + authorName + ".png";
        console.log(imageUri);

        return imageUri;
    }

    getBooksByAuthor(authorName: string) {
        console.log(authorName);
        this.router.navigate(["books", {AuthorSelected: authorName }]);
    }
    
    templateSelector(item: any, index: number, items: Array<any>) {
        return "template";
    }

}
