function getSelectedRequests() {
  const selectedRequests = [];
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked',
  );

  checkboxes.forEach((checkbox) => {
    const requestId = checkbox.id.replace('request-', '');
    selectedRequests.push(requestId);
  });

  return selectedRequests;
}

function handleValidateFormSubmit(event) {
  const selectedRequests = getSelectedRequests();
  if (selectedRequests.length === 0) {
    event.preventDefault();
    alert('Please select at least one request to validate.');
  } else {
    document.getElementById('selected-requests-input').value =
      JSON.stringify(selectedRequests);
  }
}

function openRejectModal(requestId) {
  const modal = document.getElementById('reject-modal');
  modal.dataset.requestId = requestId;
  modal.classList.remove('hidden');
}

function closeRejectModal() {
  document.getElementById('reject-modal').classList.add('hidden');
}

function handleRejectConfirm() {
  const modal = document.getElementById('reject-modal');
  const requestId = modal.dataset.requestId;
  const reason = document.getElementById('rejection-reason').value;

  const rejectForm = document.createElement('form');
  rejectForm.method = 'POST';
  rejectForm.action = `/community-requests/reject/${requestId}`;
  rejectForm.innerHTML = `<input type="hidden" name="reason" value="${reason}" />`;

  document.body.appendChild(rejectForm);
  rejectForm.submit();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const validateForm = document.getElementById('validate-requests-form');
  validateForm?.addEventListener('submit', handleValidateFormSubmit);

  const rejectConfirmButton = document.getElementById('reject-confirm');
  rejectConfirmButton?.addEventListener('click', handleRejectConfirm);
});
