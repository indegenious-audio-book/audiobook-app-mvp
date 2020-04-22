import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { TabView } from "tns-core-modules/ui/tab-view";
import { Page } from "tns-core-modules/ui/page/page";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { TNSPlayer } from "nativescript-audio";
import { knownFolders } from "tns-core-modules/file-system/file-system";

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {
    playIconFlag: string = "c";
    @ViewChild("bg", { static: false }) gridlayout: ElementRef;
    private _player: TNSPlayer;
    constructor(private router: RouterExtensions, private page: Page) {
        // Use the component constructor to inject providers.
        this._player = new TNSPlayer();
        this._player.debug = true;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.actionBarHidden = true;

    }
    async playRemoteFile() {
        this.playIconFlag = "d";
        this._player.playFromUrl({
            audioFile: "http://34.93.249.161:9000/twenty_thousand_leagues_under_the_sea/ep1.mp3",
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
    public async stopPlaying(args) {
        await this._player.dispose();
        this.playIconFlag = "c";
        alert("Media Player Disposed.");
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit Called");
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
        } else {
            this._player.play();
        }
    }

    private _trackComplete(args: any) {
        console.log("reference back to player:", args.player);
        // iOS only: flag indicating if completed succesfully
        console.log("whether song play completed successfully:", args.flag);
    }
    private _trackError(args: any) {
        console.log("reference back to player:", args.player);
        console.log("the error:", args.error);
        // Android only: extra detail on error
        console.log("extra info on the error:", args.extra);
    }
}
