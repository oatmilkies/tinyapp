<h1 align="center">TinyApp</h1>

## About The Project

TinyApp is a URL shortening service similar to TinyURL or Bitly. It allows users to shorten long URLs into more manageable and shareable links. This app was created for learning purposes as part of the Lighthouse Labs curriculum.

![tinyapp](https://github.com/oatmilkies/tinyapp/blob/main/docs/tinyapp.gif?raw=true)

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
   ![tinycreate](https://github.com/oatmilkies/tinyapp/blob/main/docs/tinycreate.jpg?raw=true)

- Here is your new short URL! You can visit the link and also edit from this page:
   ![tinyshorturl](https://github.com/oatmilkies/tinyapp/blob/main/docs/tinyshorturl.jpg?raw=true)

- Manage your shortened URLs by editing or deleting them from the MyURLs page   
   ![tinymyurls](https://github.com/oatmilkies/tinyapp/blob/main/docs/tinymyurls.jpg?raw=true)

- Shortened URLs are saved to your account and cannot be edited or deleted by other users
- Shortened URLs are shareable with anyone! :)

## License

This project is licensed under the [MIT License](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt).
