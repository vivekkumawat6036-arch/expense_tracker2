// ==================== EXPENSE TRACKER SCRIPT ====================

// --- Application State ---
let transactions = [];

// --- DOM Elements ---
const dashboardView = document.getElementById('dashboardView');
const privacyView = document.getElementById('privacyView');
const termsView = document.getElementById('termsView');

const totalBalanceEl = document.getElementById('totalBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');

const transactionListEl = document.getElementById('transactionList');
const transactionCountBadge = document.getElementById('transactionCountBadge');
const categoryBreakdownContainer = document.getElementById('categoryBreakdownContainer');

const searchQuery = document.getElementById('searchQuery');
const typeFilter = document.getElementById('typeFilter');
const categoryFilter = document.getElementById('categoryFilter');

// Modal elements
const addModal = document.getElementById('addModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addTransactionForm = document.getElementById('addTransactionForm');

const txTitleInput = document.getElementById('txTitle');
const txAmountInput = document.getElementById('txAmount');
const txTypeInput = document.getElementById('txType');
const txCategoryInput = document.getElementById('txCategory');
const txDateInput = document.getElementById('txDate');

const titleError = document.getElementById('titleError');
const amountError = document.getElementById('amountError');
const dateError = document.getElementById('dateError');

// Navigation links
const privacyLink = document.getElementById('privacyLink');
const termsLink = document.getElementById('termsLink');
const backFromPrivacyBtn = document.getElementById('backFromPrivacyBtn');
const backFromTermsBtn = document.getElementById('backFromTermsBtn');

// --- Helper: Format Currency (Indian Rupee Formatting) ---
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return "₹" + num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2
  });
}

// --- Helper: Format Readable Date ---
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  return dateStr;
}

// Simple HTML escaping helper for safe rendering
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- 1. Storage Operations ---
function loadTransactions() {
  try {
    const stored = localStorage.getItem('expense_tracker_data');
    if (stored) {
      transactions = JSON.parse(stored);
      if (!Array.isArray(transactions)) {
        transactions = [];
      }
    } else {
      // Starter transactions for demo
      transactions = [
        {
          id: 'tx-1',
          title: 'Monthly Pocket Money / Stipend',
          amount: 8000,
          type: 'income',
          category: 'Salary',
          date: '2026-10-01'
        },
        {
          id: 'tx-2',
          title: 'College Textbooks & Stationery',
          amount: 1450,
          type: 'expense',
          category: 'Education',
          date: '2026-10-05'
        },
        {
          id: 'tx-3',
          title: 'Cafeteria & Lunch',
          amount: 620,
          type: 'expense',
          category: 'Food',
          date: '2026-10-12'
        },
        {
          id: 'tx-4',
          title: 'Metro Commute Card Recharge',
          amount: 500,
          type: 'expense',
          category: 'Transport',
          date: '2026-10-15'
        }
      ];
      saveTransactions();
    }
  } catch (e) {
    console.error('Error loading transactions from localStorage:', e);
    transactions = [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem('expense_tracker_data', JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions to localStorage:', e);
  }
}

// --- 2. Calculate Summary Metrics ---
function calculateSummary() {
  let incomeSum = 0;
  let expenseSum = 0;

  transactions.forEach(item => {
    const val = parseFloat(item.amount) || 0;
    if (item.type === 'income') {
      incomeSum += val;
    } else if (item.type === 'expense') {
      expenseSum += val;
    }
  });

  const balance = incomeSum - expenseSum;

  totalBalanceEl.textContent = formatCurrency(balance);
  totalIncomeEl.textContent = formatCurrency(incomeSum);
  totalExpenseEl.textContent = formatCurrency(expenseSum);
}

// --- 3. Render Transactions List with Filters & Search ---
function renderTransactions() {
  const searchVal = searchQuery ? searchQuery.value.trim().toLowerCase() : '';
  const typeVal = typeFilter ? typeFilter.value : 'all';
  const catVal = categoryFilter ? categoryFilter.value : 'all';

  // Filter transactions matching search, type, and category
  const filtered = transactions.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchVal);
    const matchesType = (typeVal === 'all') || (item.type === typeVal);
    const matchesCategory = (catVal === 'all') || (item.category === catVal);
    return matchesSearch && matchesType && matchesCategory;
  });

  if (transactionCountBadge) {
    transactionCountBadge.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    transactionListEl.innerHTML = `
      <li class="empty-state">
        <div class="empty-state-title">No transactions found</div>
        <div class="empty-state-text">
          ${transactions.length === 0 ? 'Click "+ Add Transaction" above to create your first record.' : 'No transactions match the selected filters or search query.'}
        </div>
      </li>
    `;
    return;
  }

  // Sort by date descending (newest first)
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  transactionListEl.innerHTML = sorted.map(item => {
    const isIncome = item.type === 'income';
    const sign = isIncome ? '+' : '-';
    const amountClass = isIncome ? 'income' : 'expense';

    return `
      <li class="transaction-item" data-id="${escapeHtml(item.id)}">
        <div class="tx-details">
          <span class="tx-title">${escapeHtml(item.title)}</span>
          <div class="tx-meta">
            <span class="tx-badge">${escapeHtml(item.category)}</span>
            <span>${formatDate(item.date)}</span>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount ${amountClass}">
            ${sign} ${formatCurrency(item.amount)}
          </span>
          <button 
            type="button" 
            class="btn-danger-outline btn-delete" 
            data-id="${escapeHtml(item.id)}"
            title="Delete this transaction"
          >
            Delete
          </button>
        </div>
      </li>
    `;
  }).join('');
}

// --- 4. Render Category Spending Breakdown ---
function renderCategoryBreakdown() {
  const categoryTotals = {};
  let totalExpenseAmount = 0;

  transactions.forEach(item => {
    if (item.type === 'expense') {
      const amt = parseFloat(item.amount) || 0;
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amt;
      totalExpenseAmount += amt;
    }
  });

  const categories = Object.keys(categoryTotals);

  if (categories.length === 0 || totalExpenseAmount === 0) {
    categoryBreakdownContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">No expenses recorded</div>
        <div class="empty-state-text">Add expense transactions to view category spending analysis.</div>
      </div>
    `;
    return;
  }

  // Sort categories from highest spending to lowest
  categories.sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  categoryBreakdownContainer.innerHTML = categories.map(cat => {
    const catAmount = categoryTotals[cat];
    const percentage = Math.round((catAmount / totalExpenseAmount) * 100);

    return `
      <div class="breakdown-row">
        <div class="breakdown-info">
          <span class="breakdown-category">${escapeHtml(cat)}</span>
          <span class="breakdown-numbers">
            ${formatCurrency(catAmount)} (${percentage}%)
          </span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// --- 5. Add Transaction Handler ---
function addTransaction(title, amount, type, category, date) {
  const newTransaction = {
    id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    title: title.trim(),
    amount: parseFloat(amount),
    type: type,
    category: category,
    date: date
  };

  transactions.unshift(newTransaction);
  saveTransactions();
  updateAllViews();
}

// Delete confirmation modal elements
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteConfirmText = document.getElementById('deleteConfirmText');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let pendingDeleteId = null;

function showDeleteModal(id) {
  pendingDeleteId = id;
  const itemToDelete = transactions.find(t => String(t.id) === String(id));
  const itemName = itemToDelete ? `"${escapeHtml(itemToDelete.title)}"` : 'this transaction';
  
  if (deleteConfirmText) {
    deleteConfirmText.innerHTML = `Are you sure you want to remove <strong>${itemName}</strong>? This action cannot be undone.`;
  }
  
  if (deleteConfirmModal) {
    deleteConfirmModal.classList.add('active');
  }
}

function hideDeleteModal() {
  pendingDeleteId = null;
  if (deleteConfirmModal) {
    deleteConfirmModal.classList.remove('active');
  }
}

function confirmDeleteAction() {
  if (!pendingDeleteId) return;
  transactions = transactions.filter(item => String(item.id) !== String(pendingDeleteId));
  saveTransactions();
  updateAllViews();
  hideDeleteModal();
}

// Global handler fallback
window.handleDeleteTransaction = function(id) {
  showDeleteModal(id);
};

// Event delegation on transaction list for robust deletion
if (transactionListEl) {
  transactionListEl.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.btn-delete');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (id) {
        showDeleteModal(id);
      }
    }
  });
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener('click', hideDeleteModal);
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', confirmDeleteAction);
}

if (deleteConfirmModal) {
  deleteConfirmModal.addEventListener('click', function(e) {
    if (e.target === deleteConfirmModal) {
      hideDeleteModal();
    }
  });
}


// --- 7. Refresh All Dashboard Visuals ---
function updateAllViews() {
  calculateSummary();
  renderTransactions();
  renderCategoryBreakdown();
}

// --- 8. Modal Management & Validation ---
function openModal() {
  addTransactionForm.reset();
  titleError.style.display = 'none';
  amountError.style.display = 'none';
  dateError.style.display = 'none';
  
  // Default date to today
  const today = new Date().toISOString().split('T')[0];
  txDateInput.value = today;

  updateCategoryOptions();

  addModal.classList.add('active');
  txTitleInput.focus();
}

function closeModal() {
  addModal.classList.remove('active');
}

function updateCategoryOptions() {
  if (txTypeInput.value === 'income') {
    txCategoryInput.value = 'Salary';
  } else {
    txCategoryInput.value = 'Food';
  }
}

if (txTypeInput) {
  txTypeInput.addEventListener('change', updateCategoryOptions);
}

if (addTransactionForm) {
  addTransactionForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    // Validate Title
    const titleVal = txTitleInput.value.trim();
    if (!titleVal) {
      titleError.style.display = 'block';
      isValid = false;
    } else {
      titleError.style.display = 'none';
    }

    // Validate Amount
    const amountVal = parseFloat(txAmountInput.value);
    if (isNaN(amountVal) || amountVal <= 0) {
      amountError.style.display = 'block';
      isValid = false;
    } else {
      amountError.style.display = 'none';
    }

    // Validate Date
    const dateVal = txDateInput.value;
    if (!dateVal) {
      dateError.style.display = 'block';
      isValid = false;
    } else {
      dateError.style.display = 'none';
    }

    if (!isValid) return;

    // Save valid transaction
    addTransaction(
      titleVal,
      amountVal,
      txTypeInput.value,
      txCategoryInput.value,
      dateVal
    );

    closeModal();
  });
}

if (openAddModalBtn) openAddModalBtn.addEventListener('click', openModal);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

if (addModal) {
  // Close modal if user clicks outside of modal-box
  addModal.addEventListener('click', function(e) {
    if (e.target === addModal) {
      closeModal();
    }
  });
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && addModal && addModal.classList.contains('active')) {
    closeModal();
  }
});

// --- 9. Filter and Search Listeners ---
if (searchQuery) searchQuery.addEventListener('input', renderTransactions);
if (typeFilter) typeFilter.addEventListener('change', renderTransactions);
if (categoryFilter) categoryFilter.addEventListener('change', renderTransactions);

// --- 10. Simple View Navigation (Dashboard, Privacy Policy, Terms) ---
function showDashboard() {
  dashboardView.classList.remove('hidden');
  privacyView.classList.remove('active');
  termsView.classList.remove('active');
  window.scrollTo(0, 0);
}

function showPrivacy() {
  dashboardView.classList.add('hidden');
  privacyView.classList.add('active');
  termsView.classList.remove('active');
  window.scrollTo(0, 0);
}

function showTerms() {
  dashboardView.classList.add('hidden');
  privacyView.classList.remove('active');
  termsView.classList.add('active');
  window.scrollTo(0, 0);
}

if (privacyLink) {
  privacyLink.addEventListener('click', function(e) {
    e.preventDefault();
    showPrivacy();
  });
}

if (termsLink) {
  termsLink.addEventListener('click', function(e) {
    e.preventDefault();
    showTerms();
  });
}

if (backFromPrivacyBtn) backFromPrivacyBtn.addEventListener('click', showDashboard);
if (backFromTermsBtn) backFromTermsBtn.addEventListener('click', showDashboard);

// --- 11. Initial Application Load ---
function initApp() {
  loadTransactions();
  updateAllViews();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
