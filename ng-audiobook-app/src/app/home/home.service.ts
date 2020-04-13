import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class HomeService {
    private _homeService = new BehaviorSubject<{}>(null);
    constructor(private _http: HttpClient) {
        console.log("Check Service");
    }

    getBookGallery() {
        console.log("Book Gallery");
        this._http.get("http://10.0.2.2:8000/api/v1/books")
            .subscribe((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });
    }
}
