// Storage Ctrl
const StorageCtrl = (() => {
    return {
        storeItem: (item) => {
            let items = StorageCtrl.getItemsFromStorage();
            
            //Push new item
            items.push(item);

            //Set ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: () => {
            let items;
            localStorage.getItem('items') === null ? items = [] : items = JSON.parse(localStorage.getItem('items'));

            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);                    
                }
            });
            localStorage.setItem('items', JSON.stringify(items)); 
        },
        deleItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);                    
                } 
            });
            localStorage.setItem('items', JSON.stringify(items)); 
        },
        clearAllItems: () => {
            localStorage.removeItem('items');
        }
    }
})();


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
        items: StorageCtrl.getItemsFromStorage(), 
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
        updateItem: (name, calories) => {
            const item = ItemCtrl.getItemByID(state.currentItem.id);

            item.name = name;
            item.calories = parseInt(calories);

            return item;
        },
        deleteItem: (id) => {
            //get ids
            let ids = state.items.map( item => {
                return item.id
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            state.items.splice(index, 1);
        },
        clearAllItems: () => {
            state.items = [];
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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
        addListItem: (item) => {
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
        updateListItem: (item) => {
            const listItems = [...document.querySelectorAll(UISelectors.listItems)];
            
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`; 
                }
            });
        },
        deleteListItem: (id) => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove(); 
        },
        removeAllItems: () => {
            let listItems = [...document.querySelectorAll(UISelectors.listItems)];

            listItems.forEach( item => {
                item.remove();
            });
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
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {
    //Load Event listeners
    const loadEventListeners = () => {
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit item
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        
        //Back item event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
        
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

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = (e) => {
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

    const itemUpdateSubmit = (e) => {
        e.preventDefault();

        //Get form input from UICtrl
        const input = UICtrl.getItemInput();

        const reg = /^\d+$/; //Only numbers regex        

        //Check for name and calories input
        if(input.name !== '' && input.calories !=='' && reg.test(input.calories)) {
            //Update item state
            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

            //Update UI
            UICtrl.updateListItem(updatedItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Update ls
            StorageCtrl.updateItemStorage(updatedItem);

            //Clear fields
            UICtrl.clearEditState();
        }

    }

    const itemDeleteSubmit = (e) => {
        e.preventDefault();

        //Get current id
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from state
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from ls
        StorageCtrl.deleItemFromStorage(currentItem.id);

        //Clear fields
        UICtrl.clearEditState(); 
    }

    const clearAllItems = (e) => {
        e.preventDefault();

        //Delete all items from state
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeAllItems();

        //Hide UL
        UICtrl.hideList();
        
        //Clear ls
        StorageCtrl.clearAllItems();

    };
    
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

})(ItemCtrl, StorageCtrl, UICtrl);

//Init app
App.init(); 