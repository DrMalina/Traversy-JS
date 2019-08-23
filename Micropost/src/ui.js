class UI {
    constructor() {
        this.post = document.querySelector('#posts');
        this.titleInput = document.querySelector('#title');
        this.bodyInput = document.querySelector('#body');
        this.idInput = document.querySelector('#id');
        this.postSubmit = document.querySelector('.post-submit');
        this.formState = 'add';
    }

    showPosts(posts) {
        let output = '';

        posts.forEach( post => {
            output += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h4 class="card-title">${post.title}</h4>
                        <p class="card-text">${post.body}</p>
                        <a href="#" class="edit card-link" data-id="${post.id}">
                            <i class="fa fa-pencil"></i>
                        </a>

                        <a href="#" class="delete card-link" data-id="${post.id}">
                            <i class="fa fa-remove"></i>
                        </a>
                    </div>
                </div>
            `
        })

        this.post.innerHTML = output;
    }

    showAlert(message, className) {
        this.clearAlert();
        const div = document.createElement('div');
        div.className = className;
        //add text
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.postsContainer');
        //get posts
        const posts = document.querySelector('#posts');
        //insert alert div
        container.insertBefore(div, posts);

        //timeout
        setTimeout(() => {
            this.clearAlert();
        }, 3000)
    }

    clearAlert() {
        const currentAlert = document.querySelector('.alert');

        if(currentAlert) {
            currentAlert.remove(); 
        }
    }

    clearFields() {
        this.titleInput.value = '';
        this.bodyInput.value = '';
    }

    //Fill form to edit
    fillForm(data) {
        this.titleInput.value = data.title;
        this.bodyInput.value = data.body;
        this.idInput.value = data.id;

        this.changeFormState('edit');
    }

    clearIdInput() {
        this.idInput.value = '';
    }

    //change form state
    changeFormState(type) {
        if(type === 'edit') {
            this.postSubmit.textContent = 'Update Post';
            this.postSubmit.className = 'post-submit btn btn-warning btn-block';

            //create cancel btn
            const button = document.createElement('button');
            button.className = 'post-cancel btn btn-light btn-block';
            button.appendChild(document.createTextNode('Cancel Edit'));

            //get parent
            const cardForm = document.querySelector('.card-form');
            //get elem to insert before
            const formEnd = document.querySelector('.form-end');
            //insert cancel btn
            cardForm.insertBefore(button, formEnd);

        } else {
            this.postSubmit.textContent = 'Post it';
            this.postSubmit.className = 'post-submit btn btn-primary btn-block';

            //remove cancel btn if its there
            if(document.querySelector('.post-cancel')) {
                document.querySelector('.post-cancel').remove();
            }
            //clear hidden id
            this.clearIdInput();
            
            //clear fields
            this.clearFields();
        }
    }
}

export const ui = new UI();