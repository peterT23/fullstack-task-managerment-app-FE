## Requirements

### Authentication

- [ ] Users have to log in with email and password
- [ ] New managers can register for a new account with ame, email, and password
- [ ] Users can stay logged in even after refreshing the page.

### User Profile.

- [ ] Users can update their profile information, including name, avatar, skills, strengths, languages spoken, social links (Zalo, Facebook, inkedIn), phone number, and a short description..
- [ ] Users can change their passwords.

### Task and Project Management

- [ ] Managers can create new tasks and projects.
- [ ] Managers can update existing tasks and projects.
- [ ] Managers can assign tasks and projects to team members.
- [ ] Team members can view all tasks, projects, and comments but cannot edit them.
- [ ] Managers can delete tasks and projects.
- [ ] Managers can lock or unlock team member accounts.
- [ ] Managers can manage the actions team members can perform within the application.

### Comments

- [ ] Users can add comments to tasks and projects.
- [ ] Users can attach reference documents to comments.

### Notifications

- [ ] Users receive notifications for task assignments and updates.
- [ ] Users receive notifications for project assignments and updates.
- [ ] Users receive notifications for new comments on tasks and projects.

### Additional Features

- [ ] Users can search for tasks and projects by title or description.
- [ ] Users can filter tasks and projects by status, priority, and assignees.
- [ ] The app should provide real-time updates for tasks and projects.

### create Project

```
npx create-react-app codercom --template redux
```

- install libraries

```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab
npm install react-router-dom@6 react-hook-form @hookform/resolvers yup
npm install axios numeral lodash jwt-decode change-case
npm install react-markdown rehype-raw date-fns react-dropzone react-toastify
```

- clear src recreate src folder

- create env file outside of src folder
