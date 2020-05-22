import { Component, OnInit } from '@angular/core';
import { GenreService } from './genre.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { Genre, GenreEntity } from '../data/genre.model';
import { Page } from 'tns-core-modules/ui/page';

@Component({
    selector: 'ns-genre',
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.css'],
    moduleId: module.id
})
export class GenreComponent implements OnInit {
    genres: Array<GenreEntity> = [];
    constructor(private genreService: GenreService, private router: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = true;
        console.log(this.page.getLocationInWindow());
    }

    ngOnInit() {
        this.genreService.getGenreList()
            .subscribe((res: Genre) => {
                console.log(res.results);
                this.genres = res.results;
            }, (err) => {
                console.log(err);
            });
        console.log("Genre List" + this.genres);
    }

    getBooksByGenre(genreId: number) {
        console.log("nbn");
        console.log(genreId);
        this.router.navigate(["book", {id: genreId }]);
    }
}
