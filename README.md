## Roc8 Moonshot Assessment

### Demo
![Media1-VEED](https://github.com/user-attachments/assets/63af5c01-b8f3-42c1-9756-9fdaba1a82f1)

### TechStack

- **Frontend** - React.js, TypeScript, Chart.js
- **Backend** - Node.js, Express.js, TypesScript, MongoDB, JWT, Bcrypt, Mongoose

### Approach

- #### Task 1 - An email client like Outlook
  - Email List
    - Created a responsive UI using **React.js** and **TypeScript**
    - Displayed email list fetched from provided API using **fetch API**
    - Split the screen into left side(email list) and right side(email body).
    - Set up opening of email body of right side upon clicking any email
    - Paginated email list
  - Marking emails
    - Styled email list in such a way as to mark them as read or unread
    - Created ability to mark emails as favorite
  - Filters
    - Implemented filtering using **local storage** for persistence across sessions
    - Created filters for unread, read and favorite emails
- #### Task 2 - Data visualisation of company information
    - Charts
        - Extracted provided excel sheet data using **Google Sheet API**
        - Displayed interactive and responsive data visualisation charts utilising **Chart.js** and **React.js**
        - Created a horizontal bar chart showing Features vs Total time analysis and a vertical line chart showing Time of each feature vs Days analysis
        - Implemented click functionality for bar chart's bars, to display respective feature's data on line chart
        - Added pan, zoom-in, zoom-out options on time range on line chart
    - Filtering and sharing charts
        - Executed ability for advanced filtering by age, gender and date range.
        - Set up ability to share url with selected filter preferences to second user using url query parameters.
        - Implemented features for user sign up, log in and log out with basic login interface, before second user can access shared url
    - Backend
        - Impplemented layered RESTful API using **Node.js** and **TypeScript**
        - Developed backed to handle api calls and authentication utilising **JWT** token and **bcrypt** hashing
        - Hosted dats on **MongoDB Atlas** and handled schema using **Mongoose**
        - Deployed backend on render and frontend on vercel
