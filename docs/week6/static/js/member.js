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


function addDeleteButtonEventListener() {
  document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this message?')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/deleteMessage';
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'message_id';
                hiddenField.value = this.getAttribute('data-message-id')
                form.appendChild(hiddenField);
                document.body.appendChild(form);
                form.submit();
                form.remove();
            }
        });
    });
}

function init() {
    addSubmitContentEventListener(),
    addDeleteButtonEventListener()
}

window.onload = init;