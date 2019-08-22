// Storage Ctrl


//Item Ctrl
const ItemCtrl = (() => {

    //Item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const state = {
        items: [
            /* {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 80},
            {id: 2, name: 'Eggs', calories: 300}, */
        ],
        currentItem: null,
        totalCalories: 0
    } 
    
    return {
        getItems: ()=> {
            return state.items;
        },
        addItem: (name, calories) => {
            let ID, newItem;
            //Create ID
            if(state.items.length > 0) {
                ID = state.items[state.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Calories to numbers
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //Add to items arr
            state.items.push(newItem);

            return newItem;
        },
        getItemByID: (id) => {
            let found = state.items.find( item => item.id === id);

            return found;
        },
        setCurrentItem: (item) => {
            state.currentItem = item;
        },
        getCurrentItem: () => {
            return state.currentItem;
        },
        getTotalCalories: () => {

            let total = 0;
            state.items.forEach( item => {
                total += item.calories;
            });

            state.totalCalories = total;

            return state.totalCalories;
        },
        logState: () => {
            return state;
        }
    }
})();

//UI Ctrl
const UICtrl = (() => {

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',

    }
    
    return {
        populateItemList: (items) => {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
                        </li>`;
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: item => {
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li item
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;
            
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: (calories) => {
            document.querySelector(UISelectors.totalCalories).textContent = calories;
        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none'; 
        },
        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        getSelectors: () => UISelectors 
    }
})();

//App Ctrl
const App = ((ItemCtrl, UICtrl) => {
    //Load Event listeners
    const loadEventListeners = () => {
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Edit item
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
        
    }

    //Add item submit
    const itemAddSubmit = (e) => {
        //Get form input from UICtrl
        const input = UICtrl.getItemInput();

        const reg = /^\d+$/; //Only numbers regex        

        //Check for name and calories input
        if(input.name !== '' && input.calories !=='' && reg.test(input.calories)) {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI
            UICtrl.addListItem(newItem);
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = (e) => {
        e.preventDefault();

        if(e.target.classList.contains('edit-item')) {
            //Get list item id
            const listID = e.target.parentNode.parentNode.id;

            //Break into array
            const listIDArr = listID.split('-');

            //Get the actual id
            const id = parseInt(listIDArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemByID(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
    }
    
    return {
        init: () => {
            //set init state
            UICtrl.clearEditState();
            //Fetch Items from state structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);                
            }

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listener
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

//Init app
App.init(); 