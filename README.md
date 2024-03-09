<h1 align="center">TinyApp</h1>

## About The Project

TinyApp is a URL shortening service similar to TinyURL or Bitly. It allows users to shorten long URLs into more manageable and shareable links. This app was created for learning purposes as part of the Lighthouse Labs curriculum.

![tinyapp](https://github.com/oatmilkies/tinyapp/assets/148240283/57dca680-176f-45e4-b5ac-168150246756)

## Built With

- **Node.js**: Server-side runtime environment
- **Express.js**: Web application framework for Node.js
- **bcrypt.js**: Library for hashing passwords securely
- **cookie-session**: Middleware for handling session cookies
- **method-override**: Middleware for handling HTTP methods such as DELETE and PUT
- **EJS**: Embedded JavaScript templates for server-side rendering

## Getting Started

1. Install dependencies using
   ```
   npm install
   ```
2. Clone the repo
   ```
   git clone git@github.com:oatmilkies/tinyapp.git
   ```
3. Run the TinyApp server
   ```
   npm start
   ```
4. Open your browser and visit
   ```
   http://localhost:8080
   ```

## Usage

- Register for a new account or log in if you already have one
- Shorten a URL by clicking on "Create New URL" and entering the long URL
   ![tinycreate](https://github.com/oatmilkies/tinyapp/assets/148240283/aca1129c-db64-47fd-b3bd-874357af7121)

- Here is your new short URL! You can visit the link and also edit from this page:
   ![tinyshorturl](https://github.com/oatmilkies/tinyapp/assets/148240283/fc9d4fb4-8293-4972-b5ae-36244f862d84)

- Manage your shortened URLs by editing or deleting them from the MyURLs page   
   ![tinymyurls](https://github.com/oatmilkies/tinyapp/assets/148240283/c476c9a3-ffaa-4189-9ba2-06c65839a504)

- Shortened URLs are saved to your account and not accessible to other users

## License

This project is licensed under the [MIT License](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt).
