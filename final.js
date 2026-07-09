const addBookBtn = document.getElementById("addBook");
const library = document.getElementById("library");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("category");

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
}

// Render Books
function renderBooks(bookArray = books) {

    library.innerHTML = "";

    bookArray.forEach((book, index) => {

        const card = document.createElement("div");

        card.className = "book-card";

        if (book.favourite) {

            card.classList.add("favourite");

        }

        card.innerHTML = `

<img src="${book.image}" alt="Book Cover">

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
addBookBtn.addEventListener("click", function () {

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const review = document.getElementById("review").value.trim();

    const ratingText = document.getElementById("rating").value;
    const rating = (ratingText.match(/⭐/g) || []).length;

    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];

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

            title,
            author,
            genre,
            review,
            rating,
            image: imageData,
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
        finish(editingIndex !== null ? books[editingIndex].image: "");
    }

});

// Search
searchInput.addEventListener("input", function () {

    const query =
        searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>

        book.title.toLowerCase().includes(query) ||

        book.author.toLowerCase().includes(query)

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

        book.genre.toLowerCase() === selected

    );

    renderBooks(filteredBooks);

});

renderBooks();