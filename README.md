<p align="center">
  <img src="assets/logo.png">
</p>

## Why ?

Some text

## Get started

Simply run `npx dep-version-analizer` in a folder that contains a `package.json` file and you should see the result in your browser:

<img src="assets/application.png">

## Contributing

### Getting the local project up and running

Clone this repo locally and install the dependencies:

```
yarn install
```

Run the application locally (it doesn't have a hot reload as it is all static files):

```
yarn start
```

### Building the project

After you change something in the `src` folder, you need to run `yarn build` to generate the `bin/view-template.js` file.

### Testing the command

To test the NPX command, you have to install the local project locally by eecuting `npm i -g`. Then you can execute the following command and it will be from you local project:

```
npx dep-version-analyzer
```
