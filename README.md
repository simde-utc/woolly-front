# Woolly - Front

Woolly is the online shop of all the clubs of the Université de Technologie de Compiègne: https://assos.utc.fr/woolly/.

This project is built with [React](http://reactjs.org) and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
The API can be found here: https://github.com/simde-utc/woolly-api.

## Installation

First of all, you need to install [NodeJS](https://nodejs.org).
Then install the required packages:
```bash
npm install
```

## Development

Run the following command to start the development server:
```bash
npm run start
```

## Deployment

Build the application with:
```bash
REACT_APP_API_URL='/url_to_woolly_api' \
PUBLIC_URL='/url_to_woolly' \
npm run build
```
