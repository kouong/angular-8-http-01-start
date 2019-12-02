import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {PostsService} from './posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  private errorSubscription: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {
  }

  ngOnInit() {
    // this.fetchPosts();

    this.errorSubscription = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
      console.log(error);
    });

  }

  onCreatePost(postData: Post) {
    // Send Http request
    /*  this.http
        .post<{ name: string }>(
          'https://ng-complete-guide-7d074.firebaseio.com/posts.json',
          postData
        )
        .subscribe(responseData => {
          console.log(responseData);
        });*/
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    // this.fetchPosts();
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error;
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.clearLoadedPosts();
    });
  }

  private clearLoadedPosts() {
    this.loadedPosts = [];
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }

  /*  private fetchPosts() {
      this.isFetching = true;
      this.http
        .get<{ [key: string]: Post }>('https://ng-complete-guide-7d074.firebaseio.com/posts.json')
        // .pipe(map((responseData: { [key: string]: Post }) => {
        // Transforming data with pipe
        .pipe(map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }))
        .subscribe(posts => {
          // console.log(posts);
          this.isFetching = false;
          this.loadedPosts = posts;
        });
    }*/
}
