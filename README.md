# Hooli Demo Server
> This project acts as a backend for a fictional customer, Hooli, which uses Unum ID its [Sharified Identity](https://www.unum.id/solutions/sharified-identity) capabilities - receiving and verifying credentials for instant onboarding.

Information about the Unum ID demo ecosystem can be found in our [documentation](https://docs.unum.id/#demos).

# feathers-mikro-orm-starter

A starter app using [FeathersJS](https://feathersjs.com) and [MikroORM](https://mikro-orm.io) with some additional configuration set up

## What the starter app includes
### Feathers
- REST and socket.io transports
- Local and JWT authentication (not really configured)

### MikroORM
- postgres driver
- cli
- custom (ish) migration scripts
- config file
- `BaseEntity` abstract class with `uuid`, `createdAt`, and `updatedAt` properties

### feathers-mikro-orm
- our custom adatper to help feathers and mikroORM play nice together

### Unum ID types
- our shared types library, so you won't have to redefine the interface for a PresentationRequest again. Info can be found [here](https://www.npmjs.com/package/@unumid/types).

### ESLint
- configured for TypeScript and [semistandard](https://github.com/standard/semistandard)

### Jest
- not a whole lot of custom config here, hopefully it _jest_ works

### Logging
- [Winston](https://github.com/winstonjs/winston) configured to log to system out.

### Environment config
- dotenv
- example `.env` file with a few variables defined for database access, logging, etc
- `config.ts` file exporting all of our environment variables with correct types and default values

### How to Use
- clone this repository
- create a new repo in our github organzation and update the origin remote to it (so you don't accidentally push changes to this starter repo) 
- that's about it, really


### About Feathers

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

#### Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/featheres-mikro-orm-starter
    yarn install
    ```

3. Start your app

    ```
    yarn start
    ```

#### Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

#### Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

#### Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Release Instructions
### Dev
Just merging changes to `main` will trigger automated deployments to dev.

### Sandbox
To release version of this project to sandbox push a tag with a preceding `v`. This will trigger an automated deployment to sandbox.