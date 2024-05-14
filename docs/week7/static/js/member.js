function addSubmitContentEventListener() {
    const messageForm = document.getElementById('message-form');
    messageForm.onsubmit = function(e) {
        const content = document.getElementById('message-content').value.trim();
        if (!content) {
            e.preventDefault(); 
            alert('Message content cannot be empty!');
        }
    };
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
        const newName = document.getElementById('update-name-content').value.trim();
        const newNameInput = document.getElementById('update-name-content'); 
        if (!newName) {
            alert('Name cannot be empty!');
            return;
        }

        fetch('/api/member', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: newName})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.ok) {
                const memberName = document.getElementById('member-name');
                const updateStatusDiv = document.getElementById('update-status');
                memberName.innerText = newName;
                updateStatusDiv.innerText = '更新成功！';
                newNameInput.value = '';
            } else {
                updateStatusDiv.innerText = '更新失敗！';
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
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

function init() {
    addSubmitContentEventListener(),
    addSubmitSearchMemberEventListener(),
    addUpdateMemberNameEventListener(),
    setUpMessageListEventListeners()
}

window.onload = init;