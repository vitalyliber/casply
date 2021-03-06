# Welcome to Casply

## What's Casply?

[Casply](https://www.casply.com) is a web-application for sharing a cosplay experience.

Casply based on a popular framework Ruby on Rails and very easy to use. 

## Getting Started

First of all you need to install [Ruby Version Manager](https://rvm.io/rvm/install).
Then you can install Ruby 2.4.3 via running the command in terminal:

```
rvm install ruby 2.4.3@cosplayers
rvm use 2.4.3@cosplayers
```

Remember further when you will open console in root of project
RVM automatically will set ruby version and gemset for you.

After that you may download project dependencies:

```
gem install bundler
bundle install
```

Cool! You are on a right way!

Create the .env file in the root of project:

```
SECRET_KEY_BASE=xxx
FACEBOOK_APP_ID=xxx
VK_APP_ID=xxx
VK_REDIRECT_URI=http://localhost:3000/users/social_auth_vk
VK_CLIENT_SECRET=xxx
MAPS_JS_API_KEY=xxx
VAPID_PUBLIC_KEY=BAy-5i7Zn_4mX6k3IyF-T6LchxtdoZ8WUDHoCJfDBjCA055mVaTY3ebgvRjZ9TaQ-iidVw9BckgHhW2YFGsKuUY=
VAPID_PRIVATE_KEY=JqbjR2XGz5BtTrTTRzUD-NnCQgm4OHVv5maPbd0MEn0=
HOST='https://www.casply.com/'
```

For compatibility reasons Casply app uses PostgresSQL in development mode.
You need to have this database locally. 
Don't worry because you should't install PostgresSQL.
I suggest to use docker-compose for very fast start a ready to work database.
Just install [docker](https://www.docker.com/community-edition#/download) and run:

```
docker-compose up
```

That's all for running PostgresSQL on your PC.

When you tap ctrl + C postgres will stopped.
But don't do it before end of this manual.

You need create db and run migrations before start Casply application.
Run it in another console instance:

```
rake db:setup
```

For some interactive elements app use Node.js v9.4.0 and Yarn. 
You can install it from [here(Node)](https://nodejs.org/dist/v9.4.0/) and [here(Yarn)](https://yarnpkg.com/en/docs/install#mac-stable).

Run background job for a heavy tasks as web pushes:

```
bin/rake jobs:work
```

Congratulations! You are ready to start to work on new feature for Casply!
Just run Rails app:

```
rails start
```

Casply is available on
[http://localhost:3000](http://localhost:3000)

## License

Casply is released under the [MIT License](https://opensource.org/licenses/MIT).