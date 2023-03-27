async function fetchAssignments() {
  const token = "9612~sC8dxKpSgtzrUURRINDlOfPmbgnyPGaEuk3AGAFtcK1ulAuJPRLbZJQA0LAsa7kd";
  const response = await fetch(`/canvasApi/courseAssignments/${token}`);
  const data = await response.json();
  var assignmentL = []

  const assignmentList = document.getElementById("assignment-list");
  data.assignments.forEach((assignment, index) => {
    // Create card elements for each assignment
    const card = document.createElement("div");
    card.className = "card";

    const assignmentTitle = document.createElement("div");
    assignmentTitle.className = "assignment-title";
    assignmentTitle.textContent = assignment.name;
    card.appendChild(assignmentTitle);

    const assignmentCourse = document.createElement("div");
    assignmentCourse.className = "assignment-course";
    assignmentCourse.textContent = `Course: ${data.courses[index]}`;
    card.appendChild(assignmentCourse);

    const assignmentDueDate = document.createElement("div");
    assignmentDueDate.className = "assignment-due-date";
    const dueDate = new Date(assignment.due_at);
    assignmentDueDate.textContent = `Due Date: ${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString()}`;
    card.appendChild(assignmentDueDate);

    card.onclick = () => {
      localStorage.setItem('assignmentData', JSON.stringify(assignment));
      window.location.href = `/assignment/${assignment.id}`
    };

    assignmentList.appendChild(card);
    const gpt_result = document.querySelector("#gpt-api-result")
    gpt_result.style = "display: block";
    // Send assignments list to server
    assignmentL += data.name
  });

  const body = document.querySelector("body");
  body.removeChild(document.querySelector(".lds-roller"));
  fetch(`/answer?assignments=${JSON.stringify(assignmentL)}`)
  .then( () => {
    console.log(response.data)
    const chatBox = document.getElementById('gpt-api-result');
    const chatMessage = document.createElement('div');
    chatMessage.className = 'chat-message';
    chatMessage.textContent = response.answer;
    chatBox.appendChild(chatMessage);
  })
    .catch(error => console.error(error));
}

fetchAssignments();