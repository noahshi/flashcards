import express, { Express } from "express";
import { checkName, list, loadDeck, loadScores, saveDeck, saveScore } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.listen(port, () => console.log(`Server listening on ${port}`));

app.post('/api/save-deck', saveDeck);
app.get('/api/load-deck', loadDeck);
app.post('/api/save-score', saveScore);
app.get('/api/load-scores', loadScores);
app.get('/api/list', list);
app.get('/api/checkname', checkName);
