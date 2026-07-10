const addBookBtn = document.getElementById("addBook");
const bookForm = document.getElementById("bookForm");
const library = document.getElementById("library");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("category");
const sortBooks = document.getElementById("sortBooks");

let books = JSON.parse(localStorage.getItem("books")) || [];
let editingIndex = null;

// Save Books
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Dashboard
function updateDashboard(){
    const totalBooks = books.length;

    const favourites = books.filter(book => book.favourite).length;
    const completed = books.filter(book => book.status === "Completed").length;

    let totalRating = 0;

    books.forEach(book => {

        totalRating += book.rating;

    });

    const average =
        books.length === 0
            ? 0
            : (totalRating / books.length).toFixed(1);

    document.getElementById("totalBooks").textContent = totalBooks;

    document.getElementById("totalFav").textContent = favourites;

    document.getElementById("avgRating").textContent = average;
    document.getElementById("completedBooks").textContent = completed;

    const goal = 20;
    const progressPercent = Math.min((completed / goal) * 100, 100);

    document.getElementById("progressText").textContent = completed;
    document.getElementById("progressFill").style.width = progressPercent + "%";
}

// Render Books
function renderBooks(bookArray = books) {

    library.innerHTML = "";
    if (bookArray.length === 0) {
    library.innerHTML = `
        <div class="empty-library">
            📚
            <h2>Your library is empty</h2>
            <p>Add your first book to get started!</p>
        </div>
    `;
    updateDashboard();
    return;
}

    bookArray.forEach((book, index) => {

        const card = document.createElement("div");

        card.className = "book-card";

        if (book.favourite) {

            card.classList.add("favourite");

        }

        card.innerHTML = `

<img src="${book.image || 'images/default-book.png'}"
     alt="Book Cover"
     onerror="this.src='images/default-book.png';">

<h3>${book.title}</h3>

<p><strong>✍🏻:</strong> ${book.author}</p>

<p><strong>📚:</strong> ${book.genre}</p>

<p><strong>⭐️:</strong> ${"⭐".repeat(book.rating)}</p>

<p><strong>📖 Status:</strong> ${book.status}</p>

<p><strong>💬:</strong> ${book.review}</p>

<button class="favourite-btn">

${book.favourite ? "❤️" : "🤍"}

</button>

<button class="edit-btn">✏️ Edit</button>

<button class="delete-btn"/>🗑️ Delete</button>

`;

        library.appendChild(card);

        // Favourite

        const favouriteBtn =
            card.querySelector(".favourite-btn");

        favouriteBtn.addEventListener("click", function () {

            books[index].favourite =
                !books[index].favourite;

            saveBooks();

            renderBooks();

        });

        // Delete

        const deleteBtn =
    card.querySelector(".delete-btn");
deleteBtn.addEventListener("click", function () {

    const confirmDelete = confirm("Are you sure you want to delete this book?");

    if (!confirmDelete) {
        return;
    }

    books.splice(index, 1);

    saveBooks();

    renderBooks();

});

        // Edit

        const editBtn =
            card.querySelector(".edit-btn");

        editBtn.addEventListener("click", function () {

            document.getElementById("title").value =
                book.title;

            document.getElementById("author").value =
                book.author;

            document.getElementById("genre").value =
                book.genre;

            document.getElementById("rating").value =
                book.rating;

            document.getElementById("review").value =
                book.review;

            document.getElementById("status").value =
                book.status;

            editingIndex = index;

            addBookBtn.textContent = "Update Book";

        });

    });
    updateDashboard();

}

// Add / Update Book
bookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const review = document.getElementById("review").value.trim();

    const rating = Number(document.getElementById("rating").value);

    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];
    if (imageFile && !imageFile.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    imageInput.value = "";
    return;
}

   const status = document.getElementById("status").value;

    if (
        title === "" ||
        author === "" ||
        genre === "" ||
        rating === 0
    ) {

        alert("Please fill all required fields!");

        return;

    }
    function finish(imageData) {

        const book = {

            title: title,
            author: author,
            genre: genre,
            review: review,
            rating: rating,
            image: imageData,
            status: "Reading",
            favourite:
                editingIndex !== null
                    ? books[editingIndex].favourite
                    : false,
             status

        };

        if (editingIndex === null) {

            books.push(book);

        }

        else {

            books[editingIndex] = book;

            editingIndex = null;

            addBookBtn.textContent =
                "Add to Library";

        }

        saveBooks();

        renderBooks();

        // Clear Form

        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("review").value = "";
        document.getElementById("rating").selectedIndex = 0;
        imageInput.value = "";

    }
    if (imageFile) {

        const reader = new FileReader();

        reader.onload = function (e) {

            finish(e.target.result);

        };

        reader.readAsDataURL(imageFile);

    }
    else {
        finish(
    editingIndex !== null
        ? books[editingIndex].image
        : "Images/Book-Cover.jpg"
);
    }

});

// Search
searchInput.addEventListener("input", function () {

    const query =
        searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>

    book.title.toLowerCase().includes(query) ||

    book.author.toLowerCase().includes(query) ||

    book.genre.toLowerCase().includes(query) ||

    book.status.toLowerCase().includes(query) ||

    book.review.toLowerCase().includes(query)

);

    renderBooks(filteredBooks);

});
// Category Filter

categoryFilter.addEventListener("change", function () {

    const selected =
        categoryFilter.value.toLowerCase();

    if (selected === "") {

        renderBooks();

        return;

    }

    const filteredBooks = books.filter(book =>

    book.genre.trim().toLowerCase() === selected.trim().toLowerCase()

);

    renderBooks(filteredBooks);

});
// Sort Books

sortBooks.addEventListener("change", function(){

    let sortedBooks = [...books];

    if(sortBooks.value === "title"){

        sortedBooks.sort((a,b)=>
            a.title.localeCompare(b.title)
        );

    }

    else if(sortBooks.value === "rating"){

        sortedBooks.sort((a,b)=>
            b.rating - a.rating
        );

    }

    else if(sortBooks.value === "author"){

        sortedBooks.sort((a,b)=>
            a.author.localeCompare(b.author)
        );

    }

    renderBooks(sortedBooks);

});

renderBooks();
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", function(){

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme","dark");
        themeToggle.textContent="☀️ Light Mode";
    }
    else{
        localStorage.setItem("theme","light");
        themeToggle.textContent="🌙 Dark Mode";
    }
});
