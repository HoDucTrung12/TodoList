/**
 * PART 1) Loading data from DB to DOM tree.
 * 
 * PART 2) Adding task 
 * 
 * PART 3) Detelting task
 * 
 * PART 4) Editing task
 */



let taskAPI = [
    {
        id: 1,
        content: 'Walk the dog',
        done: false
    },

    {
        id: 2,
        content: 'Study English',
        done: false
    }
] // pretend that this is API

let taskIsBeingEdited = null;


/**
 * PART 1) Loading data from DB to DOM tree.
 * 
 * 1 I use an immediately invoked function expresion to avoid poluting global namespace.
 * 
 * 2 Iterating each entry in API to create new Nodes.
 * 
 * 3 Attaching each Nodes to DOM Tree.  
 */

let createNodeTask = function( taskDB) {
    // Check validation of input
    if( typeof taskDB != 'object') {
        console.error('The input of createNodeTask function is NOT a OBJECT type');
    } else if( !taskDB.hasOwnProperty('id')) {
        console.error('The input of createNodeTask function has NO id property');
    } else if( !taskDB.hasOwnProperty('content')) {
        console.error('The input of createNodeTask function has NO content property');
    }

    let newNode = document.createElement('li');

    newNode.classList.add('task');

    newNode.innerHTML = `
        <label class="checkbox">
            <input type="checkbox" class="checkbox__input">
            <input type="text" class="checkbox__label" maxlength="40" disabled >
        </label>
        <button data-id="${taskDB.id}" class="btn--save  none-display"><i class="fa-solid fa-floppy-disk fa-xl"></i></i></button>
        <button data-id="${taskDB.id}" class="btn--cancel  none-display"><i class="fa-solid fa-xmark fa-xl"></i></button>
        <button data-id="${taskDB.id}" class="btn--edit"><i class="fa-solid fa-pen fa-xl"></i></button>
        <button data-id="${taskDB.id}" class="btn--remove"><i class="fa-solid fa-minus fa-xl"></i></button>
    `;

    // Set data to Node
    // Do PREVENT setting value DIRECTLY to innerHTML becasue it could cause error when input value includes " or '
    let cbLabelNode = newNode.querySelector('.checkbox__label');
    cbLabelNode.setAttribute('value', taskDB.content);
    cbLabelNode.setAttribute('data-value', taskDB.content);
    

    // 
    // newNode.querySelector('.checkbox').addEventListener('click', e => {
    //     if([...e.target.classList].includes('checkbox__label') && cbLabelNode.disabled)
    //         newNode.querySelector('.checkbox__input').click();
    // }) // Toggle checkbox value when click to checkbox__label element
    


    // // Attach events be like: Edit event( relates to Save and Cancel events), Remove event 
    // let btnEdit = newNode.querySelector('.btn--edit');
    // btnEdit.addEventListener( 'click', editTaskEvent);

    // let btnSave = newNode.querySelector('.btn--save');
    // btnSave.addEventListener( 'click', saveEditEvent);

    // let btnCancel = newNode.querySelector('.btn--cancel');
    // btnCancel.addEventListener( 'click', cancelEditEvent);

    // let btnRemove = newNode.querySelector('.btn--remove');
    // btnRemove.addEventListener( 'click', removeTaskEvent);

    return newNode;
}

let loadDOMTree = function() {
    let taskContainer = document.querySelector('.list-tasks');

    taskAPI.forEach( element => {
        let newNode = createNodeTask( element)
        taskContainer.appendChild( newNode);
    });


};

loadDOMTree();

// document.querySelector('.list-tasks').addEventListener('click', function(e) {
//     let element = e.target;
//     console.log(element);
//     if(element.matches('.btn--edit, .fa-pen')) {
        
//     }
// })

/**
 * PART 2) Handling adding-task event.
 * 
 * 1 Get input value
 * 
 * 2 Check input value -> If it's empty or all whitepsace -> Throw error and Stop
 * 
 * 3 Create a new entry -> Push into DB
 * 
 * 4 Create a new Node -> Attach to DOM tree
 */

var IDstatic = taskAPI.reduce( (largestID, element) => {
    return ( element.id > largestID ) ? element.id : largestID;
}, taskAPI[0].id); // This is used to create ID of new task entry 

let createTaskEntry = ( inputValue) => ({
    id: ++IDstatic,
    content: inputValue,
    done: false
});

let btnAdd = document.querySelector('.btn--add')
btnAdd.addEventListener( 'click', function() {
    let inputNode = document.querySelector('.input-group__input');
    
    if( /^\s*$/.test(inputNode.value)) {
        document.querySelector('.input-group__help').
        classList.add('display');
        return;
    } // To display error when users type nothing or all whitespace

    // Create new entry and push it into DB
    let newTaskEntry = createTaskEntry(inputNode.value);
    taskAPI.push(newTaskEntry); 

    // Create new Node and attach it to DOM tree
    let newTaskNode = createNodeTask(newTaskEntry);
    document.querySelector('.list-tasks').
    appendChild(newTaskNode);

    // Reset input value and input help
    inputNode.value = '';

    document.querySelector('.input-group__help').
    classList.remove('display');

});

document.querySelector('.input-group__input')
.addEventListener('keydown', e => {
    if( e.keyCode == 13)
        btnAdd.click();
}) // Trigger submit event when type enter from keyboard

/**
 * PART 3) Handling removing-task event
 * 
 * 1 Identify the task was clicked 
 * 
 * 2 Remove the corresponding task entry in DB
 * 
 * 3 Remove the corresponding task Node in DOM tree
 */

function removeTaskEvent() {
    // Confirm that should delete this task not not
    if( !confirm("Do you really want to delete this task?")) {
        return;
    }

    let id = this.getAttribute('data-id');

    // get address of this id in DB and remove it
    let index = taskAPI.slice(0)
    .reduce( ( acc, curr, i, arr) => {
        if( curr.id == id) {
            arr.splice(i);
            return i;
        }
    }, 0); // break iteration when catching appropriate id
    taskAPI = deleteElementInArray( taskAPI, index);
    
    // delete task on DOM tree
    let taskNode = this.parentNode; 
    if( ! [...taskNode.classList].includes('task')) {
        console.error("This task Node has NO 'task' class");
        return;
    }//Check whether task Node is valid
    taskNode.parentNode.removeChild(taskNode);

} // cannot use expression and arrow function to hoisting although variable type is var

function deleteElementInArray( array, index) {
    return array.slice( 0, index).concat(array.slice(index + 1));
}



/**
 * PART 4) Handling editing-task event
 * 
 * 1 Add event listener 
 * 
 * 2 Display the Save and Cancel button
 * 
 * 3 Hide the Edit and Delete button
 */

function editTaskEvent() { 
    if(taskIsBeingEdited != null) {
        taskIsBeingEdited.querySelector('.btn--save').click();
    }

    let taskNode = this.parentNode;
    if( !checkTaskNode) return;

    taskIsBeingEdited = taskNode;

    toggleEditEvent( taskNode, true);
}

function saveEditEvent() {
    let taskNode = this.parentNode;
    if( !checkTaskNode) return;

    let inputBox = taskNode.querySelector('.checkbox__label');
    if( checkMutableInputValue(inputBox)) {
        if( !confirm("You you want to save this task?")) {
            return;
        } else if( /^\s+$/.test(inputBox.value)) {
            alert("You have to type something!");
            inputBox.focus();
        inputBox.selectionStart = inputBox.selectionEnd = inputBox.value.length;
            return;
        }

        let id = this.getAttribute('data-id');
        let index = searchObjectInArray( taskAPI, "id", id); // index of element has id value in API
        if( index == null) {
            console.error('ERROR! Cannot find element has id=', id, ' in DB');
            return;
        }

        taskAPI[index].content = inputBox.value;
        inputBox.setAttribute('data-value', inputBox.value);
    }

    toggleEditEvent( taskNode, false);
}

function cancelEditEvent() {
    let taskNode = this.parentNode;
    if( !checkTaskNode) return;

    let inputBox = taskNode.querySelector('.checkbox__label');
    if( checkMutableInputValue(inputBox)) {
        let oldValue = inputBox.getAttribute('data-value');
        inputBox.value = oldValue;
    } // Rollback to old value

    toggleEditEvent( taskNode, false);
}

function checkTaskNode( node) {
    if( node.nodeType !== 1) {
        console.error('The input of toggleEditEvent is not a Node');
        return false;
    } else if( ![...taskNode.classList].includes('task')) {
        console.error("This Node don't includes task class - maybe this is not a Task Node!");
        return false;
    }
    
    return true;
}// To check whether the input type is valid

function toggleEditEvent( taskNode, flag) {
    let inputBox = taskNode.querySelector('.checkbox__label')
    
    // When turn on edit event, flag is true
    if( flag) {
        inputBox.disabled = false;
        inputBox.focus();
        inputBox.selectionStart = inputBox.selectionEnd = inputBox.value.length;

        taskNode.querySelector('.btn--save').classList.remove('none-display');
        taskNode.querySelector('.btn--cancel').classList.remove('none-display');
        taskNode.querySelector('.btn--edit').classList.add('none-display');
        taskNode.querySelector('.btn--remove').classList.add('none-display');
        
        return;
    }

    inputBox.disabled = true;
    taskNode.querySelector('.btn--save').classList.add('none-display');
    taskNode.querySelector('.btn--cancel').classList.add('none-display');
    taskNode.querySelector('.btn--edit').classList.remove('none-display');
    taskNode.querySelector('.btn--remove').classList.remove('none-display');
} // To change UI of task edit

function checkMutableInputValue(inputNode) {
    let currentInputValue = inputNode.value;
    let oldValue = inputNode.getAttribute('data-value');
  
    return currentInputValue != oldValue;
}

function searchObjectInArray( array, properName, value) {
    array = [...array];

    return array.reduce((res, element, index, arr) => {
        if( element.hasOwnProperty(properName)) {
            if(element[properName] == value) {
                arr.splice(index);
                return (res = index);
            }
        }
    }, null);
}
