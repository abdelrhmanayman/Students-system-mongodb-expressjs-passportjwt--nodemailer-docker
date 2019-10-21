## Qurba assesment
to run the app: 
`docker-compose up --build`

`localhost:8080` => auth microservice
`localhost:8090` => search microservice
`localhost:9000` => operations microservices

# facebook login: since it's on dev, so only provided email can be used
`localhost:8080/facebook/login`

*you need to create your own facebook project for fb login, and provide you gmail email and password for nodemailer, put all of this in .env file*

# qurba-package github repo
`https://github.com/abdelrhmanayman/qurba-package`

P.S: open verification link sent to mail from service running laptop browser, to be able to access localhost

