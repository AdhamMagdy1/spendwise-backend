# SpendWise Backend
![spendwise](https://res.cloudinary.com/dlvznsgmk/image/upload/v1698688720/Dribbble_shot_HD_-_1_z5dne9.png)
SpendWise is a budget tracking web application that helps users keep track of their expenses. This README provides an overview of the SpendWise backend, outlining the technologies used and the main functionalities implemented.

## Technologies Used

- **Node.js**: The backend is built using Node.js, providing a server environment to handle HTTP requests.
- **Express.js**: Express is used as a web application framework for routing and middleware management.
- **MongoDB**: MongoDB is used as the database to store user and spending data.
- **Mongoose**: Mongoose is an Object Data Modeling (ODM) library for MongoDB, used for defining data schemas and interacting with the database.
- **JWT (JSON Web Tokens)**: JWT is used for user authentication, generating and verifying user tokens.
- **bcrypt**: Bcrypt is used for hashing user passwords before storing them in the database.
- **Other Dependencies**: Various other Node.js packages are used for routing, validation, and middleware.

## Features
- User Registration: Users can create an account by providing their name, email, and password. Passwords are securely hashed before storage.

- User Login: Registered users can log in using their email and password.

- User Authentication: User authentication is implemented using JWT, ensuring secure and private access to user data.

- User Data Storage: User data is stored in a MongoDB database.

- Spending Data Management: Users can add, view, and edit their spending records.

- User Budget: Users can set and manage their budget for expense tracking.
