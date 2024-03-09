# TinyApp

TinyApp is a URL shortening service similar to TinyURL or Bitly. It allows users to shorten long URLs into more manageable and shareable links.

## Features

- **User Authentication**: Users can register, log in, and log out securely.
- **URL Shortening**: Users can submit long URLs and receive a shortened version.
- **Personalized Experience**: Registered users can view a list of URLs they've shortened and edit or delete them.

## Tech Stack

TinyApp is built using the following technologies:

- **Node.js**: Server-side runtime environment.
- **Express.js**: Web application framework for Node.js.
- **bcrypt.js**: Library for hashing passwords securely.
- **cookie-session**: Middleware for handling session cookies.
- **method-override**: Middleware for handling HTTP methods such as DELETE and PUT.
- **EJS**: Embedded JavaScript templates for server-side rendering.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Run the server using `npm start`.
5. Open your browser and visit `http://localhost:8080`.

## Usage

1. Register for a new account or log in if you already have one.
2. Shorten a URL by clicking on "Create New URL" and entering the long URL.
3. Manage your shortened URLs by editing or deleting them from the dashboard.
4. Share the shortened URL with others!

## License

This project is licensed under the [MIT License](LICENSE).
