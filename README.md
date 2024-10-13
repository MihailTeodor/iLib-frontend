
# iLib - A Library Web Application

The **iLib** frontend is a user interface built with Angular that interacts with two backend systems (one in Java and one in C#) to manage a library’s inventory, user loans and bookings. This application provides an easy-to-use interface for citizens and administrators to interact with the library’s resources.

## Features

### Citizen User Features
- **Search Articles**: Search for books, magazines, and DVDs.
- **Book Articles**: Book available articles.
- **View Loan and Booking History**: Check the history of previously borrowed or booked articles.

### Administrator Features
- **Manage Articles**: Add, modify, or remove articles from the library catalogue.
- **User Management**: Register new users, modify user information, and consult user histories.
- **Manage Loans**: Register new loans, returns, and extend loans on behalf of citizens.

## Technologies Used

- **Frontend Framework**: Angular18 (TypeScript, HTML, SCSS)
- **Backend Integration**: Angular interacts with two backends—one using Jakarta EE (Java) and one using .NET (C#) via RESTful APIs.
- **Authentication**: JWT-based authentication to ensure secure access to the system.
- **Routing**: Angular Router for navigating between different parts of the application.

## Setup Instructions

### Prerequisites
Before setting up the frontend application, make sure you have the following tools installed:
- **Node.js** (v12 or later)
- **npm** (Node package manager)
- **Angular CLI** (Install globally using: `npm install -g @angular/cli`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MihailTeodor/iLib-frontend.git
   cd iLib-frontend
   ```

2. **Install dependencies**:
   Run the following command to install the required npm packages:
   ```bash
   npm install
   ```

### Running the Application

   To start a local development server, run:
   ```bash
   ng serve
   ```
   This will start the Angular development server and host the application at:
   ```
   http://localhost:4200/
   ```

### Backend Configuration

By default, the application is configured to interact with two backend APIs: one in **Java** and one in **C#**. The backend base URLs can be configured in the `backend.service.ts` service:

```typescript
  switchToJavaBackend(): void {
    this.currentBackendNameSubject.next("Java Backend");
    this.currentBackendUrlSubject.next('http://localhost:8080/iLib/v1');
  }

  switchToCsharpBackend(): void {
    this.currentBackendNameSubject.next("C# Backend");
    this.currentBackendUrlSubject.next('http://localhost:5062/iLib/v1');
  }
```
