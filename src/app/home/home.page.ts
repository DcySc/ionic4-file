import {Component, OnInit} from '@angular/core';
import {FileService} from '../file.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    name = '';

    text = '';

    constructor(
        private fileService: FileService
    ) {
    }

    ngOnInit() {
        this.fileService.text.subscribe(it => this.text = it);
    }

    create() {
        if (this.name === '' || this.text === '') return;
        this.fileService.create(this.name, this.text);
    }

    read() {
        if (this.name === '') return;
        this.fileService.readAsText(this.name);
    }

    update() {
        if (this.name === '' || this.text === '') return;
        this.fileService.writeExistingFile(this.name, this.text);
    }

    delete() {
        if (this.name === '') return;
        this.fileService.removeFile(this.name);
    }
}
