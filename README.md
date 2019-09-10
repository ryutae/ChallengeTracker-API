# Challenge Tracker API
[Live App](https://ryutae-challenge-tracker-app.now.sh)
[Client Repo](https://github.com/ryutae/ChallengeTracker-client)

## Summary

Challenge Tracker is an app that allows you create or join challenge groups to track with friends, family, co-workers, classmates, etc. Complete challenges and see your progress and compare yourself with other people in the group. 

## Technologies
[Node.js](https://nodejs.org/en/) / [Express](https://expressjs.com/) / [PostgreSQL](https://www.postgresql.org/) / [Mocha](https://mochajs.org/)+[Chai](http://chaijs.com/) testing / [Heroku](https://www.heroku.com/)

The Challenge Tracker API is an Expresss application using Node.js built on a PostgreSQL database
- Passwords are encrypted with bcryptjs
- JWT authentication is session-based and does not persist
- API endpoints are tested with Mocha, Chai

## API Documentation
Most endpoints require JWT authentication
- POST `/api/auth/register` - create user account
- POST `/api/auth/login` - login (`user_name` and `password` in req.body)
- GET `/api/groups/all` - returns all groups
- GET `/api/groups/:group_id` - returns group info
- GET `api/groups/:group_id/allusers` - returns all users in group
- POST `api/groups/join/:group_id/ - join group with user
- POST `api/groups/create/new` - create new group
- GET `api/challenges/all` - get all challenges
- GET `api/challenges/group/:group_id` - get challenges in group
- GET `api/challenges/:challenge_id` - gets challenge info
- DELETE `api/challenges/:challenge_id` - deletes challenge
- POST `api/challenges/create` - creates challenge
- POST `api/challenges/complete/:challenge_id` - completes challenge
- GET `api/challenges/complete/:challenge_id`- check if challenge is complete
- GET `api/challenges/group/:group_id/completed` - gets completed challenges by user
- GET `api/challenges/group/:group_id/uncompleted` - gets uncompleted challenges by user
- GET `api/users/:user_id` - gets user info
- GET `api/users/group/:group_id` - gets user info in group
- PATCH `api/users/updatepoints` - updates points for user in group

## Screenshots
<img src="/public/Complete_Incomplete_list.png" width="500" alt="challenge-list">
<img src="/public/Leaderboard.png" width="500" alt="leaderboard">

