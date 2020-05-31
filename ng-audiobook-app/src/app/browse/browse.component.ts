import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
// tslint:disable-next-line:no-duplicate-imports
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import { TNSPlayer } from "nativescript-audio";
import { ActivatedRoute } from "@angular/router";
import { BookService } from "../book/book.service";
import { ChapterEntity, Chapter, BookEntity, Book } from "../data/book.model";
import { Observable } from "@nativescript/core/data/observable";
import { isAndroid, isIOS } from "tns-core-modules/ui/page";
import { Slider } from "tns-core-modules/ui/slider/slider";

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {
    selectedBook: any;
    imageUri: any;
    trackDurationNumberView: string = "0";
    chapterList: Array<ChapterEntity>;
    _slider: Slider;
    currentTimeView: string;
    
    // @ObservableProperty() remainingDuration: number;
    
    playIconFlag: string = "c";
    isPlaying: boolean = false;
    currentTrack: string = "";
    @ViewChild("bg", { static: false }) gridlayout: ElementRef;

    private timer: number ;
    private _player: TNSPlayer;
    private remainingDuration: number;
    private currentTime: number;
    
    // tslint:disable-next-line:max-line-length
    constructor(private router: RouterExtensions, private page: Page, private routeParams: ActivatedRoute, private bookService: BookService) {
        // Use the component constructor to inject providers.
        this._player = new TNSPlayer();
        this._player.debug = true;
        this._slider = page.getViewById("player") as Slider;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.actionBarHidden = true;
        this.routeParams.params
            .forEach((params) => { this.selectedBook = +params.BookSelected; });
        console.log(this.selectedBook);
        this.bookService.getBooksBychapter(this.selectedBook).subscribe((res: Chapter) => {
            this.chapterList = res.results;
        });
        this.bookService.getBook(this.selectedBook).subscribe((res: BookEntity) => {
            const thumbnail_url: string = res.thumbnail_url;
            console.log(`image uri`, thumbnail_url);
            this.imageUri = "http://34.93.249.161:9000/thumbnails/" + thumbnail_url ;
        });

        // implementing back button
        // TODO need to understand what to do for the IOS app.
        if (isAndroid) {
            app.android.on(
                    AndroidApplication.activityBackPressedEvent,
                    (data: AndroidActivityBackPressedEventData) => {
                data.cancel = false; // do not override the default behaviour
                this.stopPlaying();
                // this.goBack();
            });
        }
    }
    async playRemoteFile(chapter: ChapterEntity) {
        if (this._player.isAudioPlaying()) {
            this._player.pause();
            this.playIconFlag = "d";
            this.isPlaying = false;
        }
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.playIconFlag = "d";
            this.currentTrack = chapter.chapter_title_vernacular;
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
                        // for android need to convert to minutes
                        if (isAndroid) {
                            this.trackDurationNumberView = this._msToTime(duration);
                        } else if (isIOS) {
                            this.trackDurationNumberView = String(duration / 60);
                        }
                        this._startDurationTracking(duration);
                        // console.log(`promise: ${promise}`);
                        console.log(`song duration:`, duration);
                    });
                    // this._startDurationTracking();
                });
        }
    }

    // async PlayLocalFile() {
    //     const audioFolder = knownFolders.currentApp().getFolder("audio");
    //     console.log(audioFolder);
    //     const recordedFile = audioFolder.getFile(`ep1.mp3`);
    //     console.log(recordedFile);
    //     // const localFile = localFolder.getFile(`${args.object.audioId.toString()}.mp3`);
    //     this._player.playFromFile({
    //         audioFile: recordedFile.path,
    //         loop: false,
    //         completeCallback: this._trackComplete.bind(this),
    //         errorCallback: this._trackError.bind(this)
    //     })
    //         .then(() => {
    //             this._player.getAudioTrackDuration().then((duration) => {
    //                 // iOS: duration is in seconds
    //                 // Android: duration is in milliseconds
    //                 console.log(`song duration:`, duration);
    //             });
    //         });
    // }
    async stopPlaying() {
        console.log("Tales App - stopping player");
        await this._player.dispose();
        this.isPlaying = false;
        this.playIconFlag = "c";
        clearInterval(this.timer);
    }

    goBack() {
        // right now stopping the player when you go remote.
        // but we need to make this stop the player when the app exits.
        this.stopPlaying(); // TODO remove this in a future release

        this.router.back();
    }

    blurImg() {
        console.log("Tales App - Blur Image func called");
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    
    // onSliderValueChange(args) {
    //     const newValue = <Slider>args.newValue;
    //     this._player.currentTime = newValue;
    //     console.log(`Slider new value ${args.value}`);
    // }

    togglePlay() {
        if (this._player.isAudioPlaying()) {
            this._player.pause();
            this.playIconFlag = "c";
            this.isPlaying = false;
        } else {
            if (this.currentTrack !== "") {
                this._player.play();
                this.playIconFlag = "d";
            } else {
                console.log("Tales App - will try to play the first chapter.");
                if (Array.isArray(this.chapterList) && this.chapterList.length) {
                    this.playRemoteFile(this.chapterList[0]);
                }
            }
        }
    }

    private _trackComplete(args: any) {
        this.isPlaying = false;
        console.log("Tales App - reference back to player:", args.player);
        // iOS only: flag indicating if completed succesfully
        console.log("Tales App - whether song play completed successfully:", args.flag);
    }
    private _trackError(args: any) {
        this.isPlaying = false;
        console.log("Tales App - reference back to player:", args.player);
        console.log("Tales App - the error:", args.error);
        // Android only: extra detail on error
        console.log("Tales App - extra info on the error:", args.extra);
    }
    private async _startDurationTracking(duration) {
        console.log("inside duration tracking");
        this.remainingDuration = 0;
        if (this._player && this._player.isAudioPlaying()) {
            // console.log("inside duration tracking");
            this.timer = setInterval(() => {
                // console.log(`_startDurationTracking: duration is ${duration}`);
                // console.log(`_startDurationTracking: current time is ${this._player.currentTime}`);
                this.currentTime = this._player.currentTime;
                this.remainingDuration = duration - this.currentTime;
                this.currentTimeView = this._msToTime(this.currentTime);
                console.log(`this.remainingDuration = ${this.remainingDuration}`);
            }, 1000);
        }
    }
    private _msToTime(duration) {
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        const hoursStr = (hours < 10) ? "0" + hours : hours;
        const minutesStr = (minutes < 10) ? "0" + minutes : minutes;
        const secondsStr = (seconds < 10) ? "0" + seconds : seconds;
      
        if (hours === 0) {
            return minutesStr + ":" + secondsStr;
        } else {
            return hoursStr + ":" + minutesStr + ":" + secondsStr;
        }
      }
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
