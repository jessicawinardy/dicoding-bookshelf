const buku = [];
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

    
});