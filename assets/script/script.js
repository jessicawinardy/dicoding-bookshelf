const books = [];
const RENDER_BOOKS = 'render-books';
const SAVE_BOOKS = 'save-books';
const STORAGE_KEY = 'BOOKSHELF-APP'

function isStorageExist(){
    if(typeof(Storage)===undefined){
        alert("Maaf, browser tidak mendukung Local Storage");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('form');
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null){
            for (const book of data) {
                books.push(book);
                
            }
        }

        document.dispatchEvent(new Event(RENDER_BOOKS));
    }

    function addBook(){
        const judulBuku = document.getElementById('input-judul').value;
        const penulisBuku = document.getElementById('input-penulis').value;
        const tahunBuku = document.getElementById('input-tahun').value;
        const isRead = document.getElementById('input-selesai').checked;

        const generateID = generateId();
        const bookObject = generateBookObject(generateID, judulBuku, penulisBuku, tahunBuku, isRead);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_BOOKS));
        updateDataToStorage();
    }

    function generateId(){
        return +new Date();
    }

    function generateBookObject(id, judul, penulis, tahun){
        return {
            id,
            judul,
            penulis,
            tahun
        };
    }


});