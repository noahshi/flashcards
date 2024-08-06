"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
const port = 8088;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.listen(port, () => console.log(`Server listening on ${port}`));
app.post('/api/save-deck', routes_1.saveDeck);
app.get('/api/load-deck', routes_1.loadDeck);
app.post('/api/save-score', routes_1.saveScore);
app.get('/api/load-scores', routes_1.loadScores);
app.get('/api/list', routes_1.list);
app.get('/api/checkname', routes_1.checkName);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBMkM7QUFDM0MscUNBQXNGO0FBQ3RGLDhEQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO0FBQzFCLE1BQU0sR0FBRyxHQUFZLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVuRSxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGlCQUFRLENBQUMsQ0FBQztBQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGlCQUFRLENBQUMsQ0FBQztBQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGtCQUFTLENBQUMsQ0FBQztBQUN2QyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLG1CQUFVLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFJLENBQUMsQ0FBQztBQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGtCQUFTLENBQUMsQ0FBQyJ9