import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthorService {
    private _authorService = new BehaviorSubject<{}>(null);
    constructor(private _http: HttpClient) {
        console.log("Author Service");
    }

    getAuthorsList() {
        console.log(`getAuthor is being called.`);

        return this._http.get("http://34.93.249.161:8000/api/v1/authors/");
    }

}
