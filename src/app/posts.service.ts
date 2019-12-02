import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {catchError, map, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

// @Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    // const postData: Post = {title: title, content: content};
    const postData: Post = {title, content};
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-7d074.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  deletePosts() {
    return this.http
      .delete('https://ng-complete-guide-7d074.firebaseio.com/posts.json',
        {
          observe: 'events',
          responseType: 'text'
        }
      ).pipe(
        tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            // .....
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>('https://ng-complete-guide-7d074.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          // params: new HttpParams().set('print', 'pretty')
          params: searchParams,
          responseType: 'json'
        }
      )
      // .pipe(map((responseData: { [key: string]: Post }) => {
      // Transforming data with pipe
      .pipe(
        map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          // send to analytic server
          return throwError(errorRes);
        }));
  }
}
