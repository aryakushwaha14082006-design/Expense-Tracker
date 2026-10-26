// ==========================================
// 1. HTML ELEMENTS KO SELECT KARNA
// ==========================================

// Form aur input fields ko select karna
const transactionForm = document.getElementById("transaction-form");
const transactionName = document.getElementById("transaction-name");
const transactionAmount = document.getElementById("transaction-amount");
const transactionType = document.getElementById("transaction-type");

// Transaction history ka container
const transactionList = document.getElementById("transaction-list");

// Income, expenses aur balance ke elements
const incomeTotal = document.getElementById("income-total");
const expensesTotal = document.getElementById("expenses-total");
const balanceAmount = document.getElementById("balance-amount");


// ==========================================
// 2. TRANSACTIONS ARRAY
// ==========================================

// Saare transactions is array mein store honge
let transactions = [];


// ==========================================
// 3. LOCAL STORAGE SE DATA LOAD KARNA
// ==========================================

try {

    // Browser se pehle se saved data lena
    const savedTransactions = localStorage.getItem("transactions");

    // Check karna ki data available hai ya nahi
    if (savedTransactions) {

        // JSON string ko JavaScript array mein badalna
        const parsedTransactions = JSON.parse(savedTransactions);

        // Sirf valid transactions ko accept karna
        if (Array.isArray(parsedTransactions)) {

            transactions = parsedTransactions.filter(function (transaction) {

                return (
                    transaction &&
                    typeof transaction.id === "string" &&
                    typeof transaction.name === "string" &&
                    transaction.name.trim() !== "" &&
                    Number.isFinite(transaction.amount) &&
                    transaction.amount > 0 &&
                    ["income", "expense"].includes(transaction.type)
                );

            });
        }
    }

} catch (error) {

    // Agar saved data load na ho to console mein error dikhana
    console.error("Data load error:", error);

}


// ==========================================
// 4. DATA KO LOCAL STORAGE MEIN SAVE KARNA
// ==========================================

function saveTransactions() {

    try {

        // Array ko JSON string mein badal kar save karna
        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

    } catch (error) {

        // Save karne mein dikkat aaye to message dikhana
        console.error("Data save error:", error);
        alert("Data save nahi ho paya!");

    }

}


// ==========================================
// 5. INCOME, EXPENSES AUR BALANCE CALCULATE KARNA
// ==========================================

function updateTotals() {

    // Starting values
    let totalIncome = 0;
    let totalExpenses = 0;

    // Har transaction ko check karna
    transactions.forEach(function (transaction) {

        // Income ko total income mein add karna
        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            // Expense ko total expenses mein add karna
            totalExpenses += transaction.amount;

        }

    });

    // Balance = Income - Expenses
    const totalBalance = totalIncome - totalExpenses;

    // HTML par updated values dikhana
    incomeTotal.textContent = "₹" + totalIncome.toFixed(2);
    expensesTotal.textContent = "₹" + totalExpenses.toFixed(2);
    balanceAmount.textContent = "₹" + totalBalance.toFixed(2);

}


// ==========================================
// 6. TRANSACTION HISTORY DISPLAY KARNA
// ==========================================

function displayTransactions() {

    // Purani displayed list clear karna
    transactionList.replaceChildren();

    // Agar koi transaction nahi hai
    if (transactions.length === 0) {

        // Message ka element banana
        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "No transactions yet.";

        // Message ko HTML mein add karna
        transactionList.appendChild(message);

        // Totals update karna
        updateTotals();

        return;
    }

    // Har transaction ke liye card banana
    transactions.forEach(function (transaction) {

        // Transaction ka main card
        const item = document.createElement("div");
        item.className = "transaction-item";


        // Transaction ka naam aur type
        const info = document.createElement("div");
        info.className = "transaction-info";

        const name = document.createElement("p");
        name.className = "transaction-name";
        name.textContent = transaction.name;

        const type = document.createElement("p");
        type.className = "transaction-type-label";
        type.textContent = transaction.type;


        // Name aur type ko info container mein add karna
        info.appendChild(name);
        info.appendChild(type);


        // Transaction amount ka element
        const amount = document.createElement("span");
        amount.className = "transaction-amount";


        // Income aur expense ke liye alag display
        if (transaction.type === "income") {

            amount.classList.add("income-amount");

            amount.textContent =
                "+ ₹" + transaction.amount.toFixed(2);

        } else {

            amount.classList.add("expense-amount");

            amount.textContent =
                "- ₹" + transaction.amount.toFixed(2);

        }


        // Delete button banana
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";


        // Delete button par click hone par
        deleteButton.addEventListener("click", function () {

            // User se confirmation lena
            const confirmed = confirm(
                "Kya tum is transaction ko delete karna chahte ho?"
            );

            // Agar user confirm kare
            if (confirmed) {

                // Selected transaction ko array se remove karna
                transactions = transactions.filter(
                    function (savedTransaction) {

                        return savedTransaction.id !== transaction.id;

                    }
                );

                // Updated data save aur display karna
                saveTransactions();
                displayTransactions();

            }

        });


        // Saare elements ko transaction card mein add karna
        item.appendChild(info);
        item.appendChild(amount);
        item.appendChild(deleteButton);

        // Card ko transaction history mein add karna
        transactionList.appendChild(item);

    });

    // Income, expenses aur balance update karna
    updateTotals();

}


// ==========================================
// 7. NAYA TRANSACTION ADD KARNA
// ==========================================

// Form submit hone par function chalega
transactionForm.addEventListener("submit", function (event) {

    // Form submit hone par page refresh rokna
    event.preventDefault();


    // Input fields ki values lena
    const name = transactionName.value.trim();
    const amount = Number(transactionAmount.value);
    const type = transactionType.value;


    // Transaction name validate karna
    if (name === "") {

        alert("Transaction ka naam enter karo.");
        transactionName.focus();

        return;

    }


    // Amount validate karna
    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Amount zero se zyada enter karo.");
        transactionAmount.focus();

        return;

    }


    // Naya transaction object banana
    const transaction = {

        // Har transaction ki unique ID
        id: Date.now().toString() +
            "-" + Math.random().toString(36).slice(2),

        // Transaction ka naam
        name: name,

        // Transaction ki amount
        amount: amount,

        // Income ya expense
        type: type

    };


    // Naye transaction ko array mein add karna
    transactions.push(transaction);


    // Data save karna
    saveTransactions();


    // Updated history aur totals dikhana
    displayTransactions();


    // Form ke fields clear karna
    transactionForm.reset();


    // Cursor ko name field par wapas lana
    transactionName.focus();

});


// ==========================================
// 8. PAGE OPEN HONE PAR DATA DISPLAY KARNA
// ==========================================

// Saved transactions ko page par dikhana
displayTransactions();
