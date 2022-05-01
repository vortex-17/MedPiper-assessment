### Medpiper Assessment

### Problem statement

In the coding round, you are supposed to make a Todo App using NodeJs. The Todo app should be capable of 3 major functionalities - SignUp/Login, Boards Management, and to-do list management inside each board. You need to smartly decide the schema, system design, and how many APIs would be required to implement these functionalities and develop them.

### SignUp/ Login:  

You need to develop APIs for users to signup as new user, login, and logout. You can use a NoSQL database of your choice to store the data. Show your skills over here to show how you can make this as secure as possible. You also need to design the flow and develop the APIs to make sure that the sessions (using JWT tokens) can be maintained at the frontend level.
Bonus (Optional):
The password should be encrypted before saving using the Bcrypt library.
In the settings API, the user should be able to update his name, password and upload his profile picture.
The user can log in using an email or phone number. The user should receive an OTP by email or phone to login. You can use third-party platform of your choice to trigger the OTP. For ex. Sendgrid, twilio, AWS SNS-SES, etc...

### Boards Management

After logging in the user should be able to create a new board and delete an existing board. The API where the user creates a new board to accept the name for the API as well.

### ToDo list management

Inside the board, the user should be able to implement CRUD functionality for a to-do list. The user can also change the status of the list item as - Todo, Doing, and Done.  

### How to Run
1. Clone the repository
2. Run ```npm install```
3. Run ```nodemon server.js```
