# DVR Monitoring Frontend

This project is a frontend for [DVR Monitoring](https://gitlab.com/webyfy/iot/dvr-monitoring).

## Available Scripts

In the project directory, you can run:

### `yarn start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn test`
Launches the test runner in interactive watch mode.

### `yarn build`
Builds the app for production to the `build` folder.

## Environment Variables

To run the project locally, you need to create a `.env` file in the root of the project with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api
```

This `.env` file allows you to define environment-specific variables that can be accessed within the application.

> **Note:**  
> The `REACT_APP_API_URL` (and the port) may change depending on the backend configuration. Make sure to update this value based on the actual backend URL and port used in your project.

---
