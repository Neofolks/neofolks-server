
# Neofolks

- Backend for [Neofolks](https://neofolks.live)

## About Neofolks

- Neofolks is a student based community in Navrachana University which aims to enhance youth participation in tech events to broaden their spectrum and to provide a platform to help them upheave their tech journey by connecting with like-minded individuals.

## Technologies used

- NodeJS
- Express
- MongoDB
- MailgunAPI
- JsonWebToken

## Routes

### **All GET and DELETE routes require Basic Authentication (user, password)**

### `/teams`

**GET**: Returns JSON data of all teams stored in the db.

**POST**: Saves team to 'teams' collection and each participant in 'participant' collection in MongoDB. Generates a JWT containing participant details, embeds the JWT in a QR code for each participant and triggers an email with the code attached as .png file.

- **A team can contain at most 5 members.**
- **Each member email and phone must be unique.**

Example for a POST request body:

```
{
  "name": "Team Name",
  "memberCount": 3,
  "members": [
    {
      "name": "Member 1",
      "email": "someemail@email.com",
      "phone": "000000000"
    },
    {
      "name": "Member 2",
      "email": "someemail2@email.com",
      "phone": "1111111111"
    },
    {
      "name": "Member 1",
      "email": "someemail3@email.com",
      "phone": "2222222222"
    },
    
  ]
}
```

**DELETE**: Deletes all teams stored in db.

### `/team/<teamName>`

**GET**: Returns JSON data of the team with matching 'teamName' stored in the db. Returns error message if team does not exist.

**DELETE**: Deletes the team with matching 'teamName' stored in db.

### `/participants`

**GET**: Returns JSON data of all participants stored in the db.

**POST**: Saves participant to 'participant' collection in MongoDB.

**DELETE**: Deletes all participants stored in db.

### `/participant/<email>`

**GET**: Returns JSON data of the participant with matching 'email' stored in the db. Returns error message if participant does not exist.

**DELETE**: Deletes the participant with matching 'email' stored in db.
