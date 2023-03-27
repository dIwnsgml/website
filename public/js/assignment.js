document.addEventListener('DOMContentLoaded', async () => {
    const assignmentData = JSON.parse(localStorage.getItem('assignmentData'));
  
    const assignmentList = document.getElementById("assignment-single");
    const card = createAssignmentCard(assignmentData);
  
    assignmentList.appendChild(card);
  
    // Replace the following line with your actual ChatGPT API endpoint
    const chatGPTApiEndpoint = "https://api.openai.com/v1/engines/davinci-codex/completions";
    // Replace the following line with your actual ChatGPT API key
    const API_KEY = "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";
  
    const response = await fetch(chatGPTApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Discuss the ${assignmentData.name} assignment.`,
        max_tokens: 150
      }),
    });
  
    const data = await response.json();
    const gptApiResponse = document.getElementById("gpt-api-result");
    gptApiResponse.innerText = data.choices[0].text;
  });
  
  function createAssignmentCard(assignment) {
    const card = document.createElement("div");
    card.className = "card";
  
    const assignmentTitle = document.createElement("div");
    assignmentTitle.className = "assignment-title";
    assignmentTitle.textContent = assignment.name;
    card.appendChild(assignmentTitle);
  
    const assignmentCourse = document.createElement("div");
    assignmentCourse.className = "assignment-course";
    assignmentCourse.textContent = `Course: ${assignment.course_id}`;
    card.appendChild(assignmentCourse);
  
    const assignmentDueDate = document.createElement("div");
    assignmentDueDate.className = "assignment-due-date";
    const dueDate = new Date(assignment.due_at);
    assignmentDueDate.textContent = `Due Date: ${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString()}`;
    card.appendChild(assignmentDueDate);
  
    return card;
  }