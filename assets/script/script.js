const books = [];
const RENDER_BOOKS = 'render-books';
const SAVE_BOOKS = 'save-books';
const BOOKS_STORAGE_KEY = 'BOOKSHELF-APP'

function isStorageExist(){
    if(typeof(Storage)===undefined){
        alert("Sorry, your browser doesn't support local storage");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('add-form');
    submitBook.addEventListener('submit', add);

    function add(event){
        event.preventDefault();
        addBook();
    }

    function clearForm(){
        document.getElementById('input-title').value = '';
        document.getElementById('input-author').value = '';
        document.getElementById('input-year').value = '';
        document.getElementById('input-completed').checked = false;
    }

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(BOOKS_STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null){
            for (const book of data) {
                books.push(book);
                
            }
        }

        document.dispatchEvent(new Event(RENDER_BOOKS));
    }

    function addBook(){
        const bookTitle = document.getElementById('input-title').value;
        const bookAuthor = document.getElementById('input-author').value;
        const bookYear = document.getElementById('input-year').value;
        const isCompleted = document.getElementById('input-completed').checked;

        const generateID = generateId();
        const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, isCompleted);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_BOOKS));
        saveData();
        clearForm();
    }

    function generateId(){
        return +new Date();
    }

    function generateBookObject(id, title, author, year, isCompleted){
        return {
            id,
            title,
            author,
            year,
            isCompleted
        };
    }

    document.addEventListener(RENDER_BOOKS, function(){
        const uncompletedBooks = document.getElementById('uncompleted-list');
        uncompletedBooks.innerHTML = '';

        const completedBooks = document.getElementById('completed-list');
        completedBooks.innerHTML = '';

        for (const bookitem of books){
            const bookElement = createBook(bookitem);
            if (bookitem.isCompleted){
                completedBooks.append(bookElement);
            } else {    
                uncompletedBooks.append(bookElement);
            }
        }
    });

    document.addEventListener(SAVE_BOOKS, function(){
        alert('Data saved successfully!');
    });

    function createBook(bookObject){
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        
        const judulBuku = document.createElement('h2');
        judulBuku.innerText = bookObject.title;

        const penulisBuku = document.createElement('h3');
        penulisBuku.innerText = bookObject.author;

        const tahunBuku = document.createElement('p');
        tahunBuku.innerText = bookObject.year;

        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');
        textContainer.append(judulBuku, penulisBuku, tahunBuku);

        bookElement.appendChild(textContainer);
        
        bookElement.setAttribute('id', `book-${bookObject.id}`);

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('button-container');

        if (bookObject.isCompleted){
            bookElement.classList.add('read');

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('delete-button');
            btnDelete.classList.add('button-mini');
            btnDelete.innerText = 'Delete Book';
            btnDelete.addEventListener('click', function(){
                if (confirm("Are you sure?")) {
                    deleteBook(bookObject.id);
                  }
            });
    
            const btnUncompleted = document.createElement('button');
            btnUncompleted.classList.add('unread-button');
            btnUncompleted.classList.add('button-mini');
            btnUncompleted.innerText = 'Uncompleted';
            btnUncompleted.addEventListener('click', function(){
                addtoUncompleted(bookObject.id);
            });
            
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('unread-button');
            btnEdit.classList.add('button-mini');
            btnEdit.innerText = 'Edit Book';
            btnEdit.addEventListener('click', function(){
                editBook(bookObject.id);
            });
    
            btnContainer.append(btnEdit, btnDelete, btnUncompleted);
        } else {
            bookElement.classList.add('unread');
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('button-mini');
            btnDelete.innerText = 'Delete Book';
            btnDelete.classList.add('delete-button');
            btnDelete.addEventListener('click', function(){
                if (confirm("Are you sure?")) {
                    deleteBook(bookObject.id);
                  }
            });
    
            const btnCompleted = document.createElement('button');
            btnCompleted.classList.add('read-button');
            btnCompleted.classList.add('button-mini');
            btnCompleted.innerText = 'Completed';
            btnCompleted.addEventListener('click', function(){
                addtoCompleted(bookObject.id);
            });
    
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('edit-button');
            btnEdit.classList.add('button-mini');
            btnEdit.innerText = 'Edit Book';
            btnEdit.addEventListener('click', function(){
                editBook(bookObject.id);
            });
    
            btnContainer.append(btnEdit,btnDelete, btnCompleted);

        }

        bookElement.appendChild(btnContainer);

        return bookElement;
    }

    function addtoCompleted(bookId){
        const bookPosition = findBookIndex(bookId);
        books[bookPosition].isCompleted = true;

        document.dispatchEvent(new Event(RENDER_BOOKS));
        saveData();
    }

    function addtoUncompleted(bookId){
        const bookPosition = findBookIndex(bookId);
        books[bookPosition].isCompleted = false;

        document.dispatchEvent(new Event(RENDER_BOOKS));
        saveData();
    }

    //edit

    function editBook(bookId){
        const editForm = document.getElementById('edit-form');
        const addForm = document.getElementById('add-form');
        addForm.style.display = 'none';
        editForm.style.display = 'flex';
        const bookPosition = findBookIndex(bookId);
        const book = books[bookPosition];

        document.getElementById('input-title-edit').value = book.title;
        document.getElementById('input-author-edit').value = book.author;
        document.getElementById('input-year-edit').value = book.year;
        document.getElementById('input-completed-edit').checked = book.isCompleted;

        const submitBook = document.getElementById('edit-form');
        submitBook.addEventListener('submit', update);

        function update(){
            updateBook(bookId);
        }
    }
    
    function updateBook(bookId){
        const bookPosition = findBookIndex(bookId);
        const book = books[bookPosition];
        
        const bookTitle = document.getElementById('input-title-edit').value;
        const bookAuthor = document.getElementById('input-author-edit').value;
        const bookYear = document.getElementById('input-year-edit').value;
        const isCompleted = document.getElementById('input-completed-edit').checked;
        
        book.title = bookTitle;
        book.author = bookAuthor;
        book.year = bookYear;
        book.isCompleted = isCompleted;
        
        saveData();
        document.dispatchEvent(new Event(RENDER_BOOKS));
        backtoAdd();
    }

    function backtoAdd(){
        const editForm = document.getElementById('edit-form');
        const addForm = document.getElementById('add-form');
        addForm.style.display = 'flex';
        editForm.style.display = 'none';
    }

    //delete

    function deleteBook(bookId){
        const bookPosition = findBookIndex(bookId);
        
        if (bookPosition === -1){
            return;
        }

        books.splice(bookPosition, 1);
        
        document.dispatchEvent(new Event(RENDER_BOOKS));
        saveData();
    }

    function findBookIndex(bookId){
        for (const index in books){
            if (books[index].id === bookId){
                return index;
            }
        }
        return -1;
    }

    //search

    function searchBook(bookTitle) {
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(bookTitle.toLowerCase()));
        return filteredBooks;
    }

    function renderBooks(books) {
        const completedBookList = document.getElementById('completed-list');
        const uncompletedBookList = document.getElementById('uncompleted-list');

        completedBookList.innerHTML = '';
        uncompletedBookList.innerHTML = '';

        for (const book of books) {
            const bookElement = createBook(book);
            if (book.isCompleted) {
                completedBookList.append(bookElement);
            } else {
                uncompletedBookList.append(bookElement);
            }
        }
    }

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', function() {
        const bookTitle = searchInput.value;
        const filteredBooks = searchBook(bookTitle);
        if (filteredBooks.length === 0) {
            alert('Book not found!');
            return;
        }
        renderBooks(filteredBooks);
    });

    //save data


    function saveData() {
        if(isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKS_STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVE_BOOKS));
        }
      }

      //load data

      if(isStorageExist()) {
        loadDataFromStorage();
      }


});