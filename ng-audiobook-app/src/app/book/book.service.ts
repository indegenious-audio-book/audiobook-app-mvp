import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class BookService {
    private _bookService = new BehaviorSubject<{}>(null);
    constructor(private _http: HttpClient) {
        console.log("Book Service");
    }
    getBooksByGenre(id: number) {
        console.log("getBooksByGenre is being passed with id:"+id);
        
        return this._http.get("http://34.93.249.161:8000/api/v1/books/?genre="+id);
    }

    getBooksBychapter(id: number) {
        return this._http.get("http://34.93.249.161:8000/api/v1/chapters/?book="+id);
    }

    getBook(id: number) {
        console.log(`getBook is being passed with id:${id}`);

        return this._http.get("http://34.93.249.161:8000/api/v1/books/"+id)
    }

}
