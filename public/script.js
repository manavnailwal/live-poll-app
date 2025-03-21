const socket = io();

// Handle receiving poll data and render the poll
socket.on('pollData', (poll) => {
  console.log('Received poll:', poll);
  if (!poll || !poll.options) return;

  const pollContainer = document.getElementById('pollContainer');
  pollContainer.innerHTML = `
        <h2>${poll.question}</h2>
        ${poll.options.map((option, index) => `
            <button onclick="vote(${index})">${option}</button>
        `).join('<br>')}
        <h3>Results:</h3>
        ${poll.options.map((option, index) => `
            <div>${option}: ${poll.votes[index]} votes</div>
        `).join('')}
    `;
});

// Handle vote submission
function vote(index) {
  socket.emit('vote', index);
}

// Handle poll creation form submission
document.getElementById('pollForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const question = document.getElementById('question').value.trim();
  const options = [
    document.getElementById('option1').value.trim(),
    document.getElementById('option2').value.trim(),
    document.getElementById('option3').value.trim(),
    document.getElementById('option4').value.trim()
  ].filter(option => option !== "");

  if (question && options.length > 0) {
    socket.emit('createPoll', { question, options });
    document.getElementById('pollForm').reset();
  } else {
    alert('Please enter a question and at least one option.');
  }
});
