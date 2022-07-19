/**
 * 1. Create a 'DB'
 * 
 * 2. Load automatically data when website having been rendering.
 * 
 */

let taskList = [
    {
        id: 1,
        content: 'Walk the dog',
        done: false
    }
]

let newArrayAfterRemoveEntry = function( array, index) {
    return array.slice(0, index - 1).concat( array.slice(index + 1));
}

let eventInputFocusOut = function() {
    this.disabled = true;
    let task = this.parentNode.parentNode;
    task.querySelector('.btn--save').classList.add('none-display');
    task.querySelector('.btn--cancel').classList.add('none-display');

    task.querySelector('.btn--edit').classList.remove('none-display');
    task.querySelector('.btn--remove').classList.remove('none-display');
}

let eventSave = function() {
    let task = this.parentNode;
    let input = task.querySelector('.checkbox__label');
    
    if( input.value != input.getAttribute('data-value')) {
        if( !confirm("Do you really want to save this task?")) {
            input.focus();
            return;
        }
    }
    
    
    input.setAttribute('data-value', task.querySelector('.checkbox__label').value);  
    
    input.disabled = true;

    task.querySelector('.btn--save').classList.add('none-display');
    task.querySelector('.btn--cancel').classList.add('none-display');

    task.querySelector('.btn--edit').classList.remove('none-display');
    task.querySelector('.btn--remove').classList.remove('none-display');
}

let eventCancel = function() {
    let task = this.parentNode;
    
    task.querySelector('.checkbox__label').disabled = true;
    let oldValue = task.querySelector('.checkbox__label').getAttribute('data-value');

    if(task.querySelector('.checkbox__label').value != oldValue) {
        if( !confirm("Do you really cancel changing this task?")) {
            return;
        }
    }
    
    task.querySelector('.checkbox__label').value = oldValue;

    task.querySelector('.btn--save').classList.add('none-display');
    task.querySelector('.btn--cancel').classList.add('none-display');

    task.querySelector('.btn--edit').classList.remove('none-display');
    task.querySelector('.btn--remove').classList.remove('none-display');
}

let eventEdit = function() { 
    // to change label into text input - can type/change
    let label = this.parentNode.querySelector('.checkbox__label');
    label.disabled = false;
    label.focus();
    label.selectionStart = label.selectionEnd = label.value.length;

    let task = this.parentNode;
    task.querySelector('.btn--edit').classList.add('none-display');
    task.querySelector('.btn--remove').classList.add('none-display');
    task.querySelector('.btn--save').classList.remove('none-display');
    task.querySelector('.btn--cancel').classList.remove('none-display');


    // label.addEventListener('focusout', eventFocusOut);
    let dataValue = document.createAttribute('data-value');
}

let eventRemove = function() {

    if(!confirm("Do you really want to remove this task?")) {
        return;
    }

    let id = this.getAttribute('data-id');
    
    // search for index of element has id above in DB
    let index;
    let len = taskList.length;
    for( let i = 0; i < len; i++) {
        if( taskList[i].hasOwnProperty('id') && taskList[i].id == id) {
            index = i;
            break;
        }
    }

    // To remove:
    if( typeof index == 'number') {
        // Entry in DB
        taskList = newArrayAfterRemoveEntry(taskList, index);
        
        // Entry in DOM
        // this.parentNode.removeChild(this);
        let ul = document.querySelector('.list-tasks');
        ul.removeChild(this.parentNode);
    }
}

let createNewTask = ( task) => {
    let newLi = document.createElement('li');
    newLi.classList.add('task');
    newLi.innerHTML = `
        <label class="checkbox">
            <input type="checkbox" class="checkbox__input">
            <input type="text" class="checkbox__label" maxlength="40" disabled >
        </label>
        <button data-id="${task.id}" class="btn--save  none-display"><i class="fa-solid fa-floppy-disk fa-xl"></i></i></button>
        <button data-id="${task.id}" class="btn--cancel  none-display"><i class="fa-solid fa-xmark fa-xl"></i></button>
        <button data-id="${task.id}" class="btn--edit"><i class="fa-solid fa-pen fa-xl"></i></button>
        <button data-id="${task.id}" class="btn--remove"><i class="fa-solid fa-minus fa-xl"></i></button>
    `;
    newLi.querySelector('.checkbox__label').setAttribute('value', task.content);
    newLi.querySelector('.checkbox__label').setAttribute('data-value', task.content);


    let btnEdit = newLi.querySelector('.btn--edit');
    btnEdit.addEventListener('click', eventEdit);

    let btnRemove = newLi.querySelector('.btn--remove');
    btnRemove.addEventListener('click', eventRemove);

    let btnCancel = newLi.querySelector('.btn--cancel');
    btnCancel.addEventListener('click', eventCancel);

    let btnSave = newLi.querySelector('.btn--save');
    btnSave.addEventListener('click', eventSave);



    return newLi;
} // PART 1

function loadTaskList() {
    const taskListHTML = document.getElementsByClassName("list-tasks")[0];

    taskList.forEach( item => {
        let task = createNewTask(item);
        taskListHTML.appendChild(task);       
    })
} // PART 1

loadTaskList(); // PART 1

/**
 * Handling adding task event
 */

let IDstatic = 2;
const btnAdd = document.querySelector(".btn--add");

let createNewTaskDB = ( inputValue) => {
    return {
        id: IDstatic++,
        content: inputValue,
        done: false
    }
}

btnAdd.addEventListener( 'click', () => {
    const input = document.getElementsByName("input")[0];
    const inputHelp = document.getElementsByClassName('input-group__help')[0];
    const taskListHTML = document.getElementsByClassName("list-tasks")[0];


    // to check null input
    if( input.value == '') {
        inputHelp.classList.add('display');
        return;
    }

    // to add to DB
    let newTaskDB = createNewTaskDB( input.value);
    taskList.push(newTaskDB);

    // to add to DOM
    let newTaskDOM = createNewTask( newTaskDB);
    taskListHTML.appendChild(newTaskDOM);

    //to reset
    input.value = '';
    inputHelp.classList.remove('display');

})



/**
 * Handling deleting task event
 */
