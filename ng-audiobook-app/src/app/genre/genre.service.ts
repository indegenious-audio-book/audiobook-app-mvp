import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class GenreService {
    private _genreService = new BehaviorSubject<{}>(null);
    constructor(private _http: HttpClient) {
        console.log("Genre Service");
    }
    getGenreList() {
        return this._http.get("http://34.93.249.161:8000/api/v1/genres");
    }
}
