# TinyApp

## About The Project

TinyApp is a URL shortening service similar to TinyURL or Bitly. It allows users to shorten long URLs into more manageable and shareable links. This app was created for learning purposes as part of the Lighthouse Labs curriculum.

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
   - The Registration page:
     ![tinyregister](https://github.com/oatmilkies/tinyapp/assets/148240283/9402f972-e108-4f9d-8a52-93c682d99b42)

- Shorten a URL by clicking on "Create New URL" and entering the long URL
   - Enter the long URL
     ![tinycreate](https://github.com/oatmilkies/tinyapp/assets/148240283/e8c24eae-3cbb-413a-8839-5da1e81366c5)
   - Here is your new short URL! You can also edit from this page:
      ![tinyshorturl](https://github.com/oatmilkies/tinyapp/assets/148240283/e25bbdba-e7e9-4ee7-a4f4-8d121d8b8940)

- Manage your shortened URLs by editing or deleting them from the MyURLs page
   - MyURLs
     ![tinymyurls](https://github.com/oatmilkies/tinyapp/assets/148240283/e0db4c58-2179-4988-98e2-f6636198e8c9)

- Shortened URLs are saved to your account and not accessible to other users

## License

This project is licensed under the [MIT License](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt).
