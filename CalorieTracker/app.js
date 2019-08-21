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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
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
            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }
    
    return {
        init: () => {
            //Fetch Items from state structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);                
            }


            //Load event listener
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

//Init app
App.init(); 