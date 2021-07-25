# open-blog-api
#### You can use this API to upload your status and create, edit and delete your posts
#### When you create, edit or delete a post, other users can see the changes in real time thanks to Socket-IO :) 
##
## technologies and tools
- Node.js
- Express
- MongooDB
- Mongoose
- Socket-IO
- JWT
- bcrypt
- nodemon
##
## Install dependencies
`$ npm install`

## Run project
`$ npm run dev`
    
`$ npm start`

##
# About API
### SignUp
```sh
https://open-blog-api.herokuapp.com/auth/signup
```
> POST request with JSON body contains email,name And password

### Login
```sh
https://open-blog-api.herokuapp.com/auth/login
```
> POST request with JSON body contains email And password

### create status
```sh
https://open-blog-api.herokuapp.com/feed/status
```
> POST request with header contains Authorization :Bearer +JWT

### Update status
```sh
https://open-blog-api.herokuapp.com/feed/status
```
> Patch request with header contains Authorization :Bearer +JWT

### get Posts
```sh
https://open-blog-api.herokuapp.com/feed/posts
```
> GET request with header contains Authorization :Bearer +JWT

### get single Posts
```sh
https://open-blog-api.herokuapp.com/feed/posts/ID
```
> GET request with header contains Authorization :Bearer +JWT

### create Post
```sh
https://open-blog-api.herokuapp.com/feed/posts
```
> POST request with JSON body contains all post info

 #### There is another routes to delete and update your post 
 > All Routes need to be authunticated
 
## To use Socket-IO (Client Side)
## Install
`$ npm i socket.io-client`

```javascript
import openSocket from "socket.io-client";
 const socket = openSocket("https://open-blog-api.herokuapp.com");
    socket.on("posts", (data) => {
      if (data.action === "create") {
        this.addPost(data.post);
      } else if (data.action === "update") {
        this.updatePost(data.post);
      } else if (data.action === "delete") {
        this.loadPosts();
      }
    });
```
