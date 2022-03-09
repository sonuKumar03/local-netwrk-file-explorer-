import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, pluck } from 'rxjs/operators';
@Injectable({providedIn:'any'})
export class FileListService {
  private API_URL:String;
  constructor(private httpClient:HttpClient){
    this.API_URL="http://192.168.8.101:3000"
  }
   getFiles(limit,pageNo):Observable<any>{
     const offset = (pageNo-1)*limit;
    return this.httpClient.get<any>(this.API_URL+"/files"+`/?limit=${limit}&offset=${offset}`).pipe(
      pluck("files")
    )
  }
}
