function addCreateMessageContentEventListener() {
    const messageButton = document.getElementById('create-message-button');
    messageButton.addEventListener('click', async function() {
        const newContent = document.getElementById('create-message-content').value.trim();
        if (!newContent) {
            alert('Message content cannot be empty!');
            return;
        }
       fetch('/api/createMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            const messagesList = document.getElementById('messages-list');
            const newMessageHtml = `
                <div id="message-${data.data.id}" class="message">
                    <strong>${data.data.member_name}</strong>: 
                    <span class="message-content">${data.data.content}</span>
                    <input type="text" class="edit-input" value="${data.data.content}" style="display: none;">
                    <button class="edit-button" data-message-id="${data.data.id}">編輯</button>
                    <button class="save-button" data-message-id="${data.data.id}" style="display: none;">儲存</button>
                    <button class="cancel-button" data-message-id="${data.data.id}" style="display: none;">取消</button>
                    <button class="delete-button" data-message-id="${data.data.id}">X</button>
                </div>
            `;
            messagesList.insertAdjacentHTML('afterbegin', newMessageHtml); 
            document.getElementById('create-message-content').value = '';
        })
        .catch(error => {
            console.error('Error creating message:', error);
            alert('Error creating message: ' + error.message);
        });
    });
}


function addSubmitSearchMemberEventListener() {
    const searchButton = document.getElementById('search-member-button');
    searchButton.addEventListener('click', function(e) {
        const searchMemberContent = document.getElementById('search-member-content').value.trim();
        if (!searchMemberContent) {
            alert('Search content cannot be empty!');
            return;
        }

        fetch(`/api/member?username=${searchMemberContent}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                const infoDiv = document.getElementById('member-info');
                if (data && data.data) {
                    infoDiv.innerText = `${data.data.name} (${data.data.username})`;
                } else {
                    infoDiv.innerText = 'No Data';
                }
            })
            .catch(error => {
                console.error('Error fetching member:', error);
                document.getElementById('member-info').innerText = 'Error fetching member data';
            });
    });
}

function addUpdateMemberNameEventListener() {
    const updateButton = document.getElementById('update-name-button');
    updateButton.addEventListener('click', function(e) {
        e.preventDefault();
        const newName = document.getElementById('update-name-content').value.trim();
        if (!newName) {
            alert('Name cannot be empty!');
            return;
        }

        fetch('/api/member', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: newName})
        })
        .then(response => response.json())
        .then(data => {
            const updateStatusDiv = document.getElementById('update-status');
            if (data.ok) {
                const memberName = document.getElementById('member-name');
                memberName.innerText = newName;
                updateStatusDiv.innerText = '更新成功！';
            } else {
                updateStatusDiv.innerText = 'Failed to Update!';
            }
        })
        .catch(error => {
            console.error('Error updating name:', error);
            alert('An error occurred while updating the name');
        });
    });
}

function setUpMessageListEventListeners() {
    const messagesList = document.getElementById('messages-list');

    messagesList.addEventListener('click', function(event) {
        const target = event.target; 
        const messageId = target.dataset.messageId;
        if (!messageId) return; 

        const messageContainer = document.getElementById(`message-${messageId}`);
        if (target.classList.contains('edit-button')) {
            const editInput = messageContainer.querySelector('.edit-input');
            const messageContent = messageContainer.querySelector('.message-content');
            const saveButton = messageContainer.querySelector('.save-button');
            const cancelButton = messageContainer.querySelector('.cancel-button');
            const deleteButton = messageContainer.querySelector('.delete-button');

            editInput.style.display = 'inline';
            saveButton.style.display = 'inline-block';
            cancelButton.style.display = 'inline-block';
            messageContent.style.display = 'none';
            target.style.display = 'none';
            deleteButton.style.display = 'none';
        } else if (target.classList.contains('save-button')) {
            const editInput = messageContainer.querySelector('.edit-input');
            const newContent = editInput.value;

            fetch('/api/updateMessage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message_id: messageId, new_content: newContent })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    messageContainer.querySelector('.message-content').textContent = newContent;
                    resetEditState(messageContainer);
                } else {
                    alert('Failed to update message');
                }
            });
        } else if (target.classList.contains('cancel-button')) {
            resetEditState(messageContainer);
        } else if (target.classList.contains('delete-button') && confirm('Are you sure you want to delete this message?')) {
            fetch(`/api/deleteMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message_id: messageId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    messageContainer.remove();
                } else {
                    alert('Failed to delete message');
                }
            });
        }
    });
}

function resetEditState(container) {
    container.querySelector('.edit-input').style.display = 'none';
    container.querySelector('.save-button').style.display = 'none';
    container.querySelector('.cancel-button').style.display = 'none';
    container.querySelector('.message-content').style.display = 'inline';
    container.querySelector('.edit-button').style.display = 'inline-block';
    container.querySelector('.delete-button').style.display = 'inline-block';
}
// function addDeleteButtonEventListener() {
//   document.querySelectorAll('.delete-button').forEach(button => {
//       button.addEventListener('click', function(e) {
//             e.preventDefault();
//             if (confirm('Are you sure you want to delete this message?')) {
//                 const form = document.createElement('form');
//                 form.method = 'POST';
//                 form.action = '/deleteMessage';
//                 const hiddenField = document.createElement('input');
//                 hiddenField.type = 'hidden';
//                 hiddenField.name = 'message_id';
//                 hiddenField.value = this.getAttribute('data-message-id')
//                 form.appendChild(hiddenField);
//                 document.body.appendChild(form);
//                 form.submit();
//                 form.remove();
//             }
//         });
//     });
// }

// function addEditEventListeners() {
//     document.querySelectorAll('.edit-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const messageId = this.getAttribute('data-message-id');
//             const messageContent = document.body.querySelector(`#message-${messageId} .message-content`);
//             const editForm = document.body.querySelector(`#message-${messageId} .edit-form`);
//             const editBtn = document.body.querySelector(`#message-${messageId} .edit-button`);
//             const deleteButton = document.body.querySelector('.delete-button');
            
//             editForm.style.display = 'inline-block';
//             messageContent.style.display = 'none';
//             editBtn.style.display = 'none';
//             deleteButton.style.display = 'none';

            
//             const editFormCancelBtn = document.body.querySelector(`#message-${messageId} .cancel-button`)
//             editFormCancelBtn.addEventListener('click', function() {
//                 editForm.style.display = 'none';
//                 messageContent.style.display = 'inline-block';
//                 editBtn.style.display = 'inline-block';
//                 deleteButton.style.display = 'inline-block';
//             })
//         });
//     });
// }

// function addEditMessageEventListeners() {
//     document.querySelectorAll('.edit-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const messageId = this.dataset.messageId;
//             const messageContainer = document.querySelector(`#message-${messageId}`);
//             const editInput = messageContainer.querySelector('.edit-input');
//             const messageContent = messageContainer.querySelector('.message-content');
//             const saveButton = messageContainer.querySelector('.save-button');
//             const cancelButton = messageContainer.querySelector('.cancel-button');
//             const deleteButton = messageContainer.querySelector('.delete-button');

//             editInput.style.display = 'inline';
//             saveButton.style.display = 'inline-block';
//             cancelButton.style.display = 'inline-block';
//             messageContent.style.display = 'none';
//             button.style.display = 'none';
//             deleteButton.style.display = 'none';
//         });
//     });

//     document.querySelectorAll('.save-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const messageId = this.dataset.messageId;
//             const messageContainer = document.querySelector(`#message-${messageId}`);
//             const editInput = messageContainer.querySelector('.edit-input');
//             const newContent = editInput.value;

//             fetch('/api/updateMessage', {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message_id: messageId, new_content: newContent })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.ok) {
//                     messageContainer.querySelector('.message-content').textContent = newContent;
//                     resetEditState(messageContainer);
//                 } else {
//                     alert('Failed to update message');
//                 }
//             });
//         });
//     });

//     document.querySelectorAll('.cancel-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const messageContainer = document.querySelector(`#message-${this.dataset.messageId}`);
//             resetEditState(messageContainer);
//         });
//     });

//     document.querySelectorAll('.delete-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const messageId = this.dataset.messageId;
//             if (confirm('Are you sure you want to delete this message?')) {
//                 fetch(`/api/deleteMessage`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ message_id: messageId })
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.ok) {
//                         document.querySelector(`#message-${messageId}`).remove();
//                     } else {
//                         alert('Failed to delete message');
//                     }
//                 });
//             }
//         });
//     });
// }

// function resetEditState(container) {
//     container.querySelector('.edit-input').style.display = 'none';
//     container.querySelector('.save-button').style.display = 'none';
//     container.querySelector('.cancel-button').style.display = 'none';
//     container.querySelector('.message-content').style.display = 'inline';
//     container.querySelector('.edit-button').style.display = 'inline-block';
//     container.querySelector('.delete-button').style.display = 'inline-block';
// }

function init() {
    addCreateMessageContentEventListener(),
    addSubmitSearchMemberEventListener(),
    addUpdateMemberNameEventListener(),
    setUpMessageListEventListeners()
}

window.onload = init;