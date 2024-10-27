
# 📚 Library Management Tool

Welcome to the **Library Management Tool**! This application is designed to help users manage a library with essential features like user registration, book borrowing, and profile updates. Admin users have extended access to manage users and transactions. 

## 📋 Features

- **User Registration**: Register as a User or Admin.
- **Book Inventory**: View and borrow books, manage borrowed books with a specified borrowing limit.
- **User Profile**: Update personal information and view borrowing history.
- **Admin Access**: 
  - View transactions by book, user, or across all transactions.
  - Manage and edit user information, borrowing limits, and profile details.
  - All privileges accessible to regular users.
  
> **Note**: This tool uses the browser's IndexedDB for data storage and management, which means data is stored locally on your browser and **not in a traditional database**. Each time you start fresh, you’ll need to configure your data manually.

## 💽 About IndexedDB

**IndexedDB** is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. It allows developers to store, retrieve, and manage large data locally in the user's browser, making it suitable for offline applications. **Data stored in IndexedDB persists across browser sessions**, but it’s isolated to the user's device and browser.

## 📝 Setup Instructions

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Install Dependencies**: Run `npm install` to install necessary packages.
3. **Run the Application**: Use `npm start` to launch the application.

## 🛠️ Dependencies

- Angular 18
- Angular Material for UI
- Bootstrap for layout
- IndexedDB (via idb package)
- Tailwind CSS for styling

## 💡 Important Notes

- **Data is stored in IndexedDB**: All application data is locally stored within the browser’s IndexedDB, meaning it's accessible only within the browser and is not stored on a server.
- **Starting Fresh**: If you clear browser storage or start fresh, you’ll need to configure your data (users, books, borrowing limits) manually.

## 🎉 Enjoy managing your library!