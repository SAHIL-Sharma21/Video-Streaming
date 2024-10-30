# Video Backend services (Youtube Backend)

## Project Overview
This project is a Backend setup for a youtube like video streaming application, amiming to facilitate video management, Streaming and user interactions.

## Features
1. ``User Authentication``: User registration, login, and secure session management. 
2. ``Video Upload and Management``: Video uploads, metadata storage, and thumbnail generation.
3. ``Streaming``: Efficient video streaming using HTTP, managing video chunks for smoother performance.
4. ``Comment and Likes``: Features for user engagement with comments, likes, and views tracking.
5. ``API Documentation``: RESTful endpoints for handling all primary operations.


## Getting Started
### prerequisites
- Nodejs >= 18.0
- MongoDB >= 5.0 0r MongoDB Atlas
- Docker (optinal)

## Installation
1. **Clone the repository**
```bash
    git clone https://github.com/SAHIL-Sharma21/Video-Streaming.git
    cd Video-Streaming
```

2. **Install dependencies**
```bash
    npm install
```

3. **Set up the environment variables**
- Create a ``.env`` file inn the root directory.
- Add the required varibales as specified in ```.env.example```.

```bash
     PORT=<SERVER_PORT>
     MONGODB_URI="<Your MongoDB URL>"
     JWT_SECRET="<Your JWT Secret>"
     ACCESS_TOKEN_EXPIRY="<Your Access Token Expiry>"
     REFRESH_TOKEN_EXPIRY="<Your Refresh Token Expiry>"
     CLOUDINARY_CLOUD_NAME="<Your Cloudinary Cloud Name You>"
     CLOUDINARY_API_KEY="<Your Cloudinary API Key>"
     CLOUDINARY_API_SECRET="<Your Cloudinary API Secret>"
```

4. **Start the server**
```bash
    npm start
```

## API Documentation

### API Endpoints

1. **Users**
    - Register: **POST** ``/users/register``
    - Login:  **POST** ``/users/login``
    - Logout: **POST** ``/users/logout``
    - Refresh Token: **POST** ``/users/refresh-token``
    - Current User: **GET** ``/users/current-user``
    - Update Account Details: **PATCH** ``/users/update-account``
    - Update Avatar: **PATCH** ``/users/avatar``
    - Update Cover Image: **PATCH** ``/users/cover-image``
    - Get User Profile: **GET** ``/users/c/:userName``
    - GET Watch History: **GET** ``/users/history``

2. **Videos**
    - Get all Videos: **GET** ``/videos``
    - Post Video: **POST** ``/videos``
    - Get Video by ID: **GET** ``/videos/:videoId``
    - Update Video: **PATCH** ``/videos/:videoId``
    - Delete Video: **DELETE** ``/videos/:videoId``
    - Toggle Publish Status: **PATCH** ``/videos/toggle/publish/:videoId``

3. **Tweets**
    - Create Tweet: **POST** ``/tweets``
    - Get User Tweet: **GET** ``/tweets/user/:userId``
    - update Tweet: **PATCH** ``/tweets/:tweetId``
    - Delete Tweet: **DELETE** ``/tweets/:tweetId``

4. **Subscriptions**
    - Get Subscribed Channel: **GET** ``/subscriptions/c/:subcriberId``
    - Toggle Subscribe: **POST** ``/subscriptions/u/:channelId``
    - Get Channel Subscribers: **GET** ``/subscriptions/u/:channelId``

5. **Playlists**
    - Create Playlist: **POST** ``/playlists``
    - Get Playlist By Id: **GET** ``/playlists/:playlistId``
    - Update Playlist: **PATCH** ``/playlists/:playlistId``
    - Delete Playlist: **DELETE** ``/playlists/:playlistId``
    - Add Video to Playlist: **PATCH** ``/playlists/add/:videoId/:playlistId``
    - Remove Video from Playlist: **PATCH** ``/playlists/remove/:videoId/:playlistId``
    - Get User Playlists: **GET** ``/playlists/user/:userId``

6. **Likes**
    - Toggle Video Like: **POST** ``/likes/toggle/v/:videoId``
    - Toggle Comment Like: **POST** ``/likes/toggle/c/:commentId``
    - Toggle Tweet Like: **POST** ``/likes/toggle/t/:tweetId``
    - Get Liked Video: **GET** ``/likes/videos``

7. **Dashboard**
    - Get Channel Stats: **GET** ``/dashboard/stats``
    - Get Channel Videos: **GET** ``/dashboard/videos``

8. **Comments**
    - Get Video Comments: **GET** ``/comments/:videoId``
    - Add Comment: **POST** ``/comments/:videoId``
    - Update Comment: **PATCH** ``/comments/c/:commentId``
    - Delete Comment: **DELETE** ``/comments/c/:commentId``

9. **Healthcheck**
    - Get HealthCheck: **GET** ``/healthcheck``


## Contribution

### Issues
If you have any issues or feature requests, please open an issue or [create a pull request](https://github.com/SAHIL-Sharma21/Video-Streaming/issues/new/choose) with your feedback.

### Pull Requests
Please follow the [contributing guidelines](https://github.com/SAHIL-Sharma21/Video-Streaming/blob/main/CONTRIBUTING.md) to contribute to this project.

## License
This project is licensed under the MIT License.

