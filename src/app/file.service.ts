import {Injectable} from '@angular/core';
import {File} from '@ionic-native/file/ngx';
import {Subject} from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    text = new Subject<any>();

    constructor(
        private file: File
    ) {
    }

    create(name, text) {
        this.file.createFile(this.file.dataDirectory, name, false)
            .then(it => this.writeExistingFile(name, text))
            .catch(e => console.log(e));
    }

    writeExistingFile(name, text) {
        this.file.writeExistingFile(this.file.dataDirectory, name, text)
            .then(it => console.log(it))
            .catch(e => console.log(e));
    }

    readAsText(name) {
        this.file.readAsText(this.file.dataDirectory, name)
            .then(it => this.text.next(it))
            .catch(e => console.log(e));
    }

    removeFile(name) {
        this.file.removeFile(this.file.dataDirectory, name)
            .then(it => console.log(it))
            .catch(e => console.log(e));
    }


}
