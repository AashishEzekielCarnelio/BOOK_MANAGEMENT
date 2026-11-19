
const url = "/books";

function showMessage(text, error = false) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.style.color = error ? "red" : "green";
}

async function request(path, options) {
  try {
    const response = await fetch(path, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    showMessage(error.message, true);
    return null;
  }
}

function getInput() {
  return {
    id: Number(document.getElementById("id").value),
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    price: Number(document.getElementById("price").value)
  };
}

function validBook(book) {
  if (!Number.isInteger(book.id) || book.id <= 0 ||
      !book.title || !book.author ||
      document.getElementById("price").value.trim() === "" ||
      !Number.isFinite(book.price) || book.price < 0) {
    showMessage("Please enter valid book details", true);
    return false;
  }
  return true;
}

// Display books
function displayBooks(books) {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  books.forEach(book => {
    const row = document.createElement("tr");

    [book.id, book.title, book.author, book.price]
      .forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

    const action = document.createElement("td");

    // EDIT BUTTON
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.onclick = () => {
      document.getElementById("id").value = book.id;
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
      document.getElementById("price").value = book.price;

      showMessage("Modify details and click Save Edit");
    };

    action.appendChild(editBtn);

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteBook(book.id);

    action.appendChild(deleteBtn);
    row.appendChild(action);

    list.appendChild(row);
  });
}

// GET all books
async function getBooks() {
  const books = await request(url);

  if (books) {
    displayBooks(books);
  }
}

// POST add book
async function addBook() {
  const book = getInput();

  if (!validBook(book)) return;

  const result = await request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });

  if (result) {
    await getBooks();
    showMessage(result.message);
  }
}

// PUT update book
async function updateBook() {
  const book = getInput();

  if (!validBook(book)) return;

  const result = await request(url + "/" + book.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });

  if (result) {
    await getBooks();
    showMessage(result.message);
  }
}

// PATCH edit book
async function editBook() {
  const book = getInput();

  if (!validBook(book)) return;

  const result = await request(url + "/" + book.id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: book.title,
      author: book.author,
      price: book.price
    })
  });

  if (result) {
    await getBooks();
    showMessage(result.message);
  }
}

// DELETE book
async function deleteBook(id) {
  const result = await request(url + "/" + id, {
    method: "DELETE"
  });

  if (result) {
    await getBooks();
    showMessage(result.message);
  }
}

// GET book by ID
async function searchBook() {
  const id = Number(document.getElementById("searchId").value);

  if (!Number.isInteger(id) || id <= 0) {
    showMessage("Enter a valid Book ID", true);
    return;
  }

  const book = await request(url + "/" + id);

  if (book) {
    displayBooks([book]);
    showMessage("Book found");
  }
}

// Load books when page opens
getBooks();
