# TinyApp

URL Shortener
This is a web-based URL shortener built with Node.js and Express. It allows users to shorten long URLs into manageable links, making it easier to share them across various platforms. Users can register, log in, create short URLs, edit URLs, and delete URLs.
![node icon](https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png)

## Table of Contents
- Features
- Installation
- Usage
- Routes
- Dependencies
- License

# Features
- User Registration: Users can register with their email and password
- User Authentication: Secure login system using bcrypt for password hashing
- Shorten URLs: Convert long URLs into short, manageable links
- View URLs: Users can see a list of their shortened URLs
- Edit URLs: Modify the long URLs associated with the short links
- Delete URLs: Remove unwanted URLs from the system
- Session Management: Uses cookie-session for managing user sessions

# Installation
1. Clone the repository:
```
git clone https://github.com/yourusername/URL-shortener.git
```
2. Navigate to the project directory:
```
cd URL-shortener
```
3. Install dependencies:
```
npm install
Usage
```
4. Start the server:
```
npm start
```
5. Open your web browser and navigate to [http://localhost:8080](http://localhost:8080).
6. You can now register a new account or log in if you already have one.

# Routes
GET /: Home page. If the user is logged in, it displays a greeting; otherwise, it redirects to the login page
GET /urls.json: Returns the URL database in JSON format
GET /hello: A simple HTML page with "Hello World"
GET /register: Render the new user registration page
GET /login: Render the login page
GET /urls/new: Render the page to submit a new URL
GET /urls: Render the list of short and long URLs for the logged-in user
GET /urls/:id: Render the page showing the long URL and its short URL
GET /u/:id: Redirect to the long URL associated with the short URL
DELETE /urls/:id/delete: Remove a URL from the database
PUT /urls/:id: Edit a long URL in the database
POST /urls: Post the newly added long and short URLs to the database
POST /register: Handle user registration data
POST /login: Handle user login input
POST /logout: Clear the session cookie when the user logs out

# Dependencies
- express
- cookie-session
- bcryptjs
- method-override
- ejs

# License
This project is licensed under the MIT License.
