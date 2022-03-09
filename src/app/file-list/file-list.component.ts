import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FileListService } from './file-list.service';
@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
})
export class FileListComponent implements OnInit {
  Files:any[];
  OnScoll$:Subject<string>;
  constructor(private fileListService:FileListService ) {
    this.OnScoll$ = new Subject();
  }
  limit=10;
  pageNo=1;
  public isFullListDisplayed: boolean = false;
  ngOnInit(): void {
    this.fileListService.getFiles(this.limit,this.pageNo).subscribe(data=>{
      this.Files = [...data];
    })

    this.OnScoll$.pipe(tap((direction)=>{
      console.log(direction);
    }), switchMap(direction=>{
      // switch(direction){
      //   case 'up':this.pageNo = this.pageNo-1;break;
      //   case 'down':this.pageNo = this.pageNo+1;break;
      //   default:console.log("sorry");
      // }
      // if(this.pageNo<1){
      //   this.pageNo = 1;
      // }
      return this.fileListService.getFiles(this.limit,this.pageNo)
    })).subscribe(res=>{
      this.Files.push(...res);
    })

  }
  onScrollDown(){
    this.OnScoll$.next("down");
  }
  onScrollUp(){
    this.OnScoll$.next("up");
  }
}
