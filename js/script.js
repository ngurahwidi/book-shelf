const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedTODOList = document.getElementById('uncompleted-books');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-books');
    completedTODOList.innerHTML = '';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete)
          uncompletedTODOList.append(bookElement); 
        else
          completedTODOList.append(bookElement);  
    }           
});

function isStorageExist(){
  if(typeof(Storage) === undefined){
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}



document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
  }
});



function saveData() {
  if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
    const textBook = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isComplete = document.getElementById('completed').checked;

    const generateID = generateId();
    let  bookObject = generateTodoObject(generateID, textBook, textAuthor, year, isComplete);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const checkBox = document.getElementById('completed');
let check = false;

checkBox.addEventListener('change', function(){
  if(checkBox.checked){
    check = true;
  }else{
    check = false;
  }
})

function generateId() {
    return + new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete 
    }
}

function makeBook(bookObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const year = document.createElement('p');
    year.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle,'Penulis', textAuthor, 'Tahun', year);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            swal("Sukses!", "Buku telah dipindahkan ke rak belum selesai dibaca!", "success");
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            swal("Sukses!", "Buku telah dihapus!", "success");
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            swal("Sukses!", "Buku telah dipindahkan ke rak selesai dibaca!", "success");
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            swal("Sukses!", "Buku telah dihapus!", "success");
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    function addTaskToCompleted(bookId){
        const bookTarget = findBook(bookId);

        if(bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

    }

    function findBook(bookId){
        for (const bookItem of books) {
            if (bookItem.id === bookId){
                return bookItem;
            }
        }
        return null 
    }

    function removeTaskFromCompleted(bookId) {
        const bookTarget = findBookIndex(bookId);
       
        if (bookTarget === -1) return;
       
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
       
       
      function undoTaskFromCompleted(bookId) {
        const bookTarget = findBook(bookId);
       
        if (bookTarget == null) return;
       
        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }

      function findBookIndex(bookId) {
        for (const index in books) {
          if (books[index].id === bookId) {
            return index;
          }
        }

        return -1;
      }


    return container;
}