import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { TNSPlayer } from "nativescript-audio";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ActivatedRoute } from "@angular/router";
import { BookService } from "../book/book.service";
import { ChapterEntity, Chapter } from "../data/book.model";
import { Observable } from "@nativescript/core/data/observable";

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {
    selectedBook: any;
    trackDuration: number = 0;
    chapterList: Array<ChapterEntity>;
    //@ObservableProperty() public remainingDuration;
    playIconFlag: string = "c";
    isPlaying: boolean = false;
    currentTrack: string = "";
    @ViewChild("bg", { static: false }) gridlayout: ElementRef;
    private _player: TNSPlayer;
    constructor(private router: RouterExtensions, private page: Page, private routeParams: ActivatedRoute, private bookService: BookService) {
        // Use the component constructor to inject providers.
        this._player = new TNSPlayer();
        this._player.debug = true;

    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.actionBarHidden = true;
        this.routeParams.params
            .forEach((params) => { this.selectedBook = +params["BookSelected"]; });
        console.log(this.selectedBook);
        this.bookService.getBooksBychapter(this.selectedBook).subscribe((res: Chapter) => {
            this.chapterList = res.results;
        });
    }
    async playRemoteFile(chapter: ChapterEntity) {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.playIconFlag = "d";
            this.currentTrack = chapter.chapter_title;
            this._player.playFromUrl({
                audioFile: "http://34.93.249.161:9000/" + chapter.chapter_url,
                loop: false,
                completeCallback: this._trackComplete.bind(this),
                errorCallback: this._trackError.bind(this)
            })
                .then(() => {
                    this._player.getAudioTrackDuration().then((duration: any) => {
                        // iOS: duration is in seconds
                        // Android: duration is in milliseconds
                        this.trackDuration = (duration / 1000);
                        //this._startDurationTracking(this.trackDuration);
                        console.log(`song duration:`, duration);
                    });
                });
        }
    }

    async PlayLocalFile() {
        const audioFolder = knownFolders.currentApp().getFolder("audio");
        console.log(audioFolder);
        const recordedFile = audioFolder.getFile(`ep1.mp3`);
        console.log(recordedFile);
        // const localFile = localFolder.getFile(`${args.object.audioId.toString()}.mp3`);
        this._player.playFromFile({
            audioFile: recordedFile.path,
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        })
            .then(() => {
                this._player.getAudioTrackDuration().then((duration) => {
                    // iOS: duration is in seconds
                    // Android: duration is in milliseconds
                    console.log(`song duration:`, duration);
                });
            });
    }
    async stopPlaying() {
        await this._player.dispose();
        this.isPlaying = false;
        this.playIconFlag = "c";
    }

    goBack() {
        this.router.back();
    }

    blurImg() {
        console.log("Blur Image func called");
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    togglePlay() {
        if (this._player.isAudioPlaying()) {
            this._player.pause();
            this.playIconFlag = "c";
            this.isPlaying = false;
        } else {
            if (this.currentTrack !== "") {
                this._player.play();
                this.playIconFlag = "d";
            }

        }
    }

    private _trackComplete(args: any) {
        this.isPlaying = false;
        console.log("reference back to player:", args.player);
        // iOS only: flag indicating if completed succesfully
        console.log("whether song play completed successfully:", args.flag);
    }
    private _trackError(args: any) {
        this.isPlaying = false;
        console.log("reference back to player:", args.player);
        console.log("the error:", args.error);
        // Android only: extra detail on error
        console.log("extra info on the error:", args.extra);
    }
    // private async _startDurationTracking(duration) {
    //     if (this._player && this._player.isAudioPlaying()) {
    //         const timerId = timer.setInterval(() => {
    //             this.remainingDuration = duration - this._player.currentTime;
    //             // console.log(`this.remainingDuration = ${this.remainingDuration}`);
    //         }, 1000);
    //     }
    // }
}

export function ObservableProperty() {
    return (obj: Observable, key: string) => {
        let storedValue = obj[key];

        Object.defineProperty(obj, key, {
            get: function () {
                return storedValue;
            },
            set: function (value) {
                if (storedValue === value) {
                    return;
                }
                storedValue = value;
                this.notify({
                    eventName: Observable.propertyChangeEvent,
                    propertyName: key,
                    object: this,
                    value
                });
            },
            enumerable: true,
            configurable: true
        });
    };
}
