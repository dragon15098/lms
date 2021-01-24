import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient, HttpEventType, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class FileUploadComponent {
  @Input() text = 'Upload';
  @Input() param = 'file';
  @Input() target = 'http://localhost:8080/api/resource/upload';

  @Output() onComplete = new EventEmitter<string>();

  files: Array<FileUploadModel> = [];

  constructor(private httpClient: HttpClient) {
  }

  onClick(): void {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel): void {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel): void {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel): void {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true,
      responseType: 'text'
    });

    file.inProgress = true;
    file.sub = this.httpClient.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(
        () => {
        }),
      last(),
      catchError( error => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.onComplete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles(): void {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
