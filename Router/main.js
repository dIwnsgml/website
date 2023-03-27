const express = require("express");
const Router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const info = require("../config/info.json");
const axios = require("axios");

const canvasDomain = "https://cuhsd.instructure.com";



Router.get("/", async (req, res) => {
  res.render('index', {})
})

Router.get("/signup", async (req, res) => {
  res.render('signup', {})
})

Router.get("/canvasApi/courses/:token", async (req, res) => {
  try {
    const response = await axios.get(`${canvasDomain}/api/v1/courses`, {
      headers: { Authorization: `Bearer ${req.params.token}` },
    });
    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    res.status(500).send('Error fetching courses from Canvas');
  }
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPaginatedData(url, token) {
  let currentPage = 1;
  let allData = [];
  let hasMoreData = true;

  while (hasMoreData) {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: currentPage, per_page: 50 },
    });

    allData.push(...response.data);

    const linksHeader = response.headers.link;
    if (linksHeader) {
      const links = linksHeader.split(',');
      const nextLink = links.find(link => link.includes('rel="next"'));
      hasMoreData = nextLink !== undefined;
    } else {
      hasMoreData = false;
    }

    currentPage++;
    await delay(1000);
  }
  return allData;
}

Router.get("/canvasApi/courseAssignments/:token", async (req, res) => {
 
  const token = req.params.token;
  let courses_list = [];
  let assignment_list = [];

  try {
    const response = await axios.get(`${canvasDomain}/api/v1/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      for (let i = 0; i < response.data.length; i++) {
        if (typeof response.data[i].name != "undefined") {
          courses_list.push(response.data[i].name);
          const assignments = await axios.get(`${canvasDomain}/api/v1/courses/${response.data[i].id}/assignments`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { bucket: 'future' },
          });

          assignment_list.push(...assignments.data);
        }
      }

      // Sort assignments by due date (from most recent to earliest)
      assignment_list.sort((a, b) => {
        if (a.due_at === null) return 1;
        if (b.due_at === null) return -1;
        if (a.due_at > b.due_at) return -1;
        if (a.due_at < b.due_at) return 1;
        return 0;
      });

      const result = {
        courses: courses_list,
        assignments: assignment_list,
      };

      /* res.json(result); */
      res.send(result);

    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    res.status(500).send('Error fetching courses from Canvas');
    console.error("Error fetching courses: ", error);
  }
});

Router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

Router.get("/assignment/:id", (req, res) => {
  res.render("assignment");
});

Router.get("/answer", async(req, res) => {
  const assignments = JSON.parse(req.query.assignments);
  console.log(assignments);

  const configuration = new Configuration({
    apiKey: info.OpenAiApi,
  });
  const openai = new OpenAIApi(configuration);

  let answer = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `According to the following list of assignments, give me a detailed explanation on what I should use my time on to complete these assignments. These are my assignments: ${JSON.stringify(assignments)}`,
    temperature: 1,
  });

  answer = answer.data.choices[0].text;
  console.log(answer)
  res.send({ answer });
});

Router.get("/tokenInput", (req, res) => {
  res.render("input");
})

module.exports = Router;
