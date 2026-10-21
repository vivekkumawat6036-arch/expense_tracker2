# Expense Tracker – Personal Finance Dashboard

A responsive web-based Expense Tracker that helps users manage their personal finances by recording income and expenses, monitoring their balance, and analyzing spending by category.

## Features

- **Dashboard:** Displays total balance, total income, and total expenses.
- **Add Transactions:** Record transactions with a title, amount, type, category, and date.
- **Transaction History:** View transactions sorted by date.
- **Search Transactions:** Find transactions using their titles.
- **Filter Transactions:** Filter records by income, expenses, and category.
- **Category Breakdown:** Visualize expense distribution using progress bars.
- **Delete Transactions:** Remove records with a confirmation dialog.
- **Local Storage:** Saves transaction data in the browser so it remains available after refreshing the page.
- **Privacy Policy and Terms:** Includes informational pages accessible from the footer.
- **Responsive Design:** Supports desktop, tablet, and mobile screen sizes.
- **Modern UI:** Features a dark theme, glassmorphism panels, and teal accents.

## Technologies Used

- HTML5 – Structure of the application
- CSS3 – Styling, responsive layout, and visual effects
- JavaScript – Transaction management, calculations, filtering, and validation
- Browser Local Storage – Persistent storage of transaction records
- Google Fonts – Plus Jakarta Sans typography

## Project Structure

```text
expense-tracker/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Getting Started

### Prerequisites

You need a modern web browser such as Google Chrome, Microsoft Edge, or Firefox.

No database server, package installation, or backend server is required for basic use.

### Installation

1. Download or clone the project repository.
2. Extract the project files if downloaded as a ZIP archive.
3. Ensure the following files are in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Open `index.html` in your web browser.

### Run Using VS Code

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension if it is not already installed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The application will open in your default browser.

## How to Use

### 1. View Your Dashboard

The dashboard displays:

- Total Balance
- Total Income
- Total Expenses

These values update automatically when transactions are added or deleted.

### 2. Add a Transaction

1. Click **+ Add Transaction**.
2. Enter the transaction title and amount.
3. Select Income or Expense.
4. Choose a category.
5. Select the transaction date.
6. Click **Save Transaction**.

### 3. Search and Filter

Use the search field to find transactions by title. Use the type and category dropdowns to narrow down the transaction list.

### 4. Analyze Spending

The Spending by Category section displays expense totals and their percentage of overall expenses.

### 5. Delete a Transaction

Click the Delete button next to a transaction and confirm the action in the dialog.

## Data Storage

The application uses the browser's `localStorage` to store transactions under the key:

```text
expense_tracker_data
```

The data is stored locally in the browser rather than in a remote database.

**Important:** Data is associated with the browser and origin used to open the application. Clearing site storage or using a different browser may make saved transactions unavailable. This project does not provide cloud synchronization or automatic backups.

## Privacy and Security

- No account registration is required.
- Transaction records are stored locally in the browser.
- The application does not require a backend or database server.
- Google Fonts may load from an external service when an internet connection is available.

Avoid entering sensitive financial information into applications without appropriate security and backup measures.

## Future Improvements

Possible enhancements include:

- Monthly expense reports
- Budget limits and spending alerts
- CSV export and import
- Charts for income and expense trends
- Dark and light themes
- Transaction editing
- Optional cloud synchronization

## Project Purpose

This project demonstrates fundamental front-end web development concepts, including DOM manipulation, event handling, form validation, array operations, data filtering, responsive CSS, and browser-based data persistence.

## License

This project is available for educational and personal learning purposes. Add a formal license file if you intend to distribute it under specific reuse terms.

---

**Expense Tracker** – Track your money. Understand your spending.
