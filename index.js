import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const API_URL = "https://v2.jokeapi.dev";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// GET: Render the page with no joke
app.get('/', (req, res) => {
  res.render("index.ejs"); 
});

// POST: Render the page with jokes based on user input
app.post("/", async (req, res) => {
  const category = req.body.categories && req.body.categories !== "" ? req.body.categories : "Any";
  const blacklist = req.body.flags;
  const amount = req.body.amount && req.body.amount.trim() !== "" ? req.body.amount : 1;

  let url = `${API_URL}/joke/${category}?amount=${amount}`;
  if (blacklist && blacklist !== "") {
    url += `&blacklistFlags=${blacklist}`;
  }

  try {
    const response = await axios.get(url);
    let jokes = "";

    if (response.data.jokes) {
      jokes = response.data.jokes.map(joke =>
        joke.type === "single"
          ? joke.joke
          : `${joke.setup} ... ${joke.delivery}`
      ).join("<br><br>");
    } else {
      jokes = response.data.type === "single"
        ? response.data.joke
        : `${response.data.setup} ... ${response.data.delivery}`;
    }

    res.render("index.ejs", { content: jokes });
  } catch (error) {
    res.render("index.ejs", { content: "Failed to fetch jokes." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});