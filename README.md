# Blogify-2026

A simple blog application built with Node.js, Express, MongoDB, and EJS. Users can sign up, sign in, create blog posts with cover images, view blog details, and add comments.

This project was created as a learning project for building a full-stack blog app using the Node.js ecosystem.

## Live demo

The app is hosted here:

http://swami-blogs-env.eba-2yukyxvq.ap-south-1.elasticbeanstalk.com/

## Project overview

The app includes:

- user registration and login
- JWT-based cookie authentication
- blog creation with a cover image upload
- homepage displaying all blog cards
- individual blog detail page
- comment system on each blog
- EJS templates for rendering pages
- local static file serving for styles, images, and uploaded blog images

## Tech stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS templating
- JWT for authentication
- Multer for file uploads
- Cookie parser
- Bootstrap 5

## Folder structure

```text
.
├── app.js
├── .env
├── .gitignore
├── package.json
├── README.md
├── public/
│   ├── images/
│   ├── styles/
│   └── uploads/
├── platform/
│   └── nginx/
│       └── conf.d/
│           └── proxy.conf
├── routes/
│   ├── blog.js
│   └── user.js
├── services/
│   └── authentication.js
├── middlewares/
│   └── authentication.js
├── models/
│   ├── blog.js
│   ├── comment.js
│   └── user.js
├── views/
│   ├── addBlog.ejs
│   ├── blog.ejs
│   ├── home.ejs
│   ├── signin.ejs
│   ├── signup.ejs
│   └── partials/
└── node_modules/
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB locally

Make sure MongoDB is running on your machine.

The default connection used in the app is:

```env
MONGO_URL = mongodb://localhost:27017/swamiBlogs
```

If your MongoDB is not running, start it first.

### 3. Create environment variables

Create a `.env` file in the project root with the following values:

```env
MONGO_URL = mongodb://localhost:27017/swamiBlogs
PORT = 8000
```

Note:

- `.env` is intentionally ignored in Git
- do not push your local `.env` file to GitHub
- for production or deployment, set environment variables on your hosting platform instead

### 4. Start the app

Development mode:

```bash
npm run dev
```

Or run directly:

```bash
node app.js
```

Then open:

```text
http://localhost:8000
```

## Application behavior

### Authentication

The app uses a JWT stored in an HTTP-only cookie named `token`.

- users sign up and login
- the server creates a JWT token
- the token is saved in a cookie
- each request checks the token through middleware
- the session expires after 1 hour

The token is generated in `services/authentication.js` and validated in `middlewares/authentication.js`.

## Important files to know

### User model
The user schema contains:

- `fullName`
- `email`
- `password`
- `profileImageUrl`
- `role`

### Blog model
The blog schema contains:

- `title`
- `body`
- `coverImageUrl`
- `createdBy`

## Endpoints

### Home page

```http
GET /
```

Description:

- shows all blogs in a card-based homepage layout
- renders the home page using EJS
- passes `user` and `blogs` to the view

### User routes

#### Sign up page

```http
GET /user/signup
```

Shows the signup form.

#### Sign up submit

```http
POST /user/signup
```

Body fields:

- `fullName`
- `email`
- `password`

What it does:

- creates a new user in MongoDB
- hashes the password before save
- creates a JWT token
- stores it in an HTTP-only cookie
- redirects to `/`

#### Sign in page

```http
GET /user/signin
```

Shows the login form.

#### Sign in submit

```http
POST /user/signin
```

Body fields:

- `email`
- `password`

What it does:

- validates email/password
- generates a JWT token
- sets the cookie
- redirects to `/`

#### Logout

```http
GET /user/logout
```

What it does:

- clears the token cookie
- redirects to `/`

### Blog routes

#### Add blog page

```http
GET /blog/add-new
```

Requires login.

Shows the form for creating a blog.

#### Create blog

```http
POST /blog
```

Form fields:

- `title`
- `body`
- `coverImage` (file upload)

What it does:

- uploads the image to `public/uploads`
- builds a blog document
- saves `coverImageUrl` as `/uploads/<filename>`
- redirects to the blog detail page

#### View blog by id

```http
GET /blog/:id
```

Description:

- loads a single blog
- populates the author
- loads all comments for that blog
- renders the blog detail page

#### Add comment

```http
POST /blog/comment/:blogId
```

Body fields:

- `content`

What it does:

- creates a comment entry for the selected blog
- redirects back to the same blog page

## Uploaded files and static assets

The app stores uploaded blog images under:

```text
public/uploads/
```

These files are intentionally ignored in Git to prevent pushing user-generated uploads to the repo.

The current `.gitignore` includes:

```gitignore
/public/uploads/*
!/public/uploads/.gitkeep
```

This keeps the folder structure but ignores uploaded image files.

## Git ignore notes

The repo should ignore:

- `.env`
- `.env.*`
- `node_modules/`
- uploaded content in `public/uploads/`
- OS/editor junk like `.DS_Store`, `.vscode/`, `.idea/`, and zip files

This is important so local secrets and generated files are not accidentally pushed.

## Deployment notes

For AWS Elastic Beanstalk, there is a Nginx override file:

```text
platform/nginx/conf.d/proxy.conf
```

with:

```nginx
client_max_body_size 20M;
```

This is used to allow larger image uploads through the reverse proxy.

Without this setting, Nginx can reject large upload requests with HTTP 413.

> Note: the upload size is ultimately controlled by the default Nginx limit on the hosting platform. If the platform-specific configuration does not take effect in Elastic Beanstalk, the app will still be limited by the default Nginx request-body limit regardless of the value set in app code or config files.

## Security notes

- JWT is stored in an HTTP-only cookie
- `httpOnly: true` prevents JavaScript access to the cookie
- token expiration is set to 1 hour
- `.env` should not be committed to Git

## How this project works in simple terms

This app is a small blogging platform where:

- a user signs up and logs in
- a user creates a blog post with title, body, and image
- homepage displays all posts
- clicking a blog shows the full article and comments
- users can comment on posts
- all of this is powered by Node, Express, MongoDB, and EJS

## Potential improvements for the future

Some improvements worth considering later:

- move business logic into controllers
- modularize route logic and services more cleanly
- add profile image upload support
- add pagination for blogs
- add validation and error handling for file upload limits
- move uploaded files to cloud storage like AWS S3 for production

## License

This project is for learning and personal development purposes.

## Author

Blogify-2026
