import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { saveDeck, resetDecksForTesting, loadDeck, list, loadScores, saveScore, resetScoresForTesting, checkName } from './routes';


describe('routes', function() {
  it('save-deck', function() {
    // First branch, straight line code, error case: missing name
    const req1 = httpMocks.createRequest({method: 'POST', url: '/save', body: {value: "value"}});
    const res1 = httpMocks.createResponse();
    saveDeck(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    const req2 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: 0, value: "value"}});
    const res2 = httpMocks.createResponse();
    saveDeck(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input): missing value
    const req3 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: "name"}});
    const res3 = httpMocks.createResponse();
    saveDeck(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'required argument "value" was missing');
    
    // Third branch, straight line code
    const req5 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: "name", value: "value"}});
    const res5 = httpMocks.createResponse();
    saveDeck(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);

    const req6 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: "name 2", value: "value 2"}});
    const res6 = httpMocks.createResponse();
    saveDeck(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 200);

    resetDecksForTesting();
  });

  it('load-deck', function(){
    //Saving files to be used in tests
    var saveReq = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
      body: { name: "key", value: "deck value" } });
    var saveResp = httpMocks.createResponse();
    saveDeck(saveReq, saveResp);
    var saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "key 2", value: "deck value 2" } });
    var saveResp2 = httpMocks.createResponse();
    saveDeck(saveReq2, saveResp2);

    // First branch, straight line code, error case: missing name
    var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: {} });
    var res1 = httpMocks.createResponse();
    loadDeck(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: { name: 88 } });
    var res2 = httpMocks.createResponse();
    loadDeck(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    // Second branch, straight line code, error case: deck not found
    var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: { name: "not a key" } });
    var res3 = httpMocks.createResponse();
    loadDeck(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 404);
    assert.deepStrictEqual(res3._getData(), 'deck not found');

    var req4 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: { name: "not a key 2" } });
    var res4 = httpMocks.createResponse();
    loadDeck(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 404);
    assert.deepStrictEqual(res4._getData(), 'deck not found')
    ;
    // Third branch, straight line code
    var req5 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: { name: "key" } });
    var res5 = httpMocks.createResponse();
    loadDeck(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), { value: "deck value" });

    var req6 = httpMocks.createRequest({ method: 'GET', url: '/api/load-deck', query: { name: "key 2" } });
    var res6 = httpMocks.createResponse();
    loadDeck(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), { value: "deck value 2" });

    resetDecksForTesting();
  });

  it('save-score', function(){
    //Saving decks for testing
    var sdReq = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 1", value: "deck value" } });
    var sdResp = httpMocks.createResponse();
    saveDeck(sdReq, sdResp);
    var sdReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 2", value: "deck value 2" } });
    var sdResp2 = httpMocks.createResponse();
    saveDeck(sdReq2, sdResp2);

    //Branch 1: error case: missing name
    var req1 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { deck: "deck 1", value: 14 } });
    var res1 = httpMocks.createResponse();
    saveScore(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    var req2 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: 14, deck: "deck 2", value: 22 } });
    var res2 = httpMocks.createResponse();
    saveScore(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    //Branch 2: error case: missing deck
    var req3 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "deck 1", value: 14 } });
    var res3 = httpMocks.createResponse();
    saveScore(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'required argument "deck" was missing');

    var req4 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name 2", deck: 900, value: 22 } });
    var res4 = httpMocks.createResponse();
    saveScore(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), 'required argument "deck" was missing');

    //Branch 3: error case: missing value
    var req5 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "deck 1", deck : "deck 1"} });
    var res5 = httpMocks.createResponse();
    saveScore(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), 'required argument "value" was missing');

    var req6 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name 2", deck: "deck 2", value: "twenty-eight" } });
    var res6 = httpMocks.createResponse();
    saveScore(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), 'required argument "value" was missing');

    //Branch 4: error case: deck not found
    var req7 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "deck 1", deck : "name 1", value: 0} });
    var res7 = httpMocks.createResponse();
    saveScore(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 404);
    assert.deepStrictEqual(res7._getData(), 'deck not found');

    var req8 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name 2", deck: "deck 4", value: 100 } });
    var res8 = httpMocks.createResponse();
    saveScore(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 404);
    assert.deepStrictEqual(res8._getData(), 'deck not found');

    //Branch 5: straight line code
    var req9 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "deck 1", deck : "deck 1", value: 2} });
    var res9 = httpMocks.createResponse();
    saveScore(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);

    var req10 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name 2", deck: "deck 2", value: 99 } });
    var res10 = httpMocks.createResponse();
    saveScore(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);

    resetScoresForTesting();
    resetDecksForTesting();
  });

  it('load-scores', function(){
    //Saving decks for testing
    var sdReq = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 1", value: "deck value" } });
    var sdResp = httpMocks.createResponse();
    saveDeck(sdReq, sdResp);
    var sdReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 2", value: "deck value 2" } });
    var sdResp2 = httpMocks.createResponse();
    saveDeck(sdReq2, sdResp2);
    //Straight line code
    //test 1
    var saveReq = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name", deck: "deck 1", value: 14 } });
    var saveResp = httpMocks.createResponse();
    saveScore(saveReq, saveResp);
    var saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/save-score',
        body: { name: "name 2", deck: "deck 2", value: 22 } });
    var saveResp2 = httpMocks.createResponse();
    saveScore(saveReq2, saveResp2);
    
    var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/load-scores' });
    var res1 = httpMocks.createResponse();
    loadScores(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), { value: [["name", "deck 1", 14], ["name 2", "deck 2", 22]] });

    resetScoresForTesting();
    //test 2
    var saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/api/save-score',
        body: { name: "name 3", deck: "deck 1", value: 77 } });
    var saveResp3 = httpMocks.createResponse();
    saveScore(saveReq3, saveResp3);
    var saveReq4 = httpMocks.createRequest({ method: 'POST', url: '/api/save-score',
        body: { name: "name 3", deck: "deck 1", value: 77 } });
    var saveResp4 = httpMocks.createResponse();
    saveScore(saveReq4, saveResp4);
    var saveReq5 = httpMocks.createRequest({ method: 'POST', url: '/api/save-score',
        body: { name: "name 3", deck: "deck 1", value: 77 } });
    var saveResp5 = httpMocks.createResponse();
    saveScore(saveReq5, saveResp5);

    var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/load-scores' });
    var res2 = httpMocks.createResponse();
    loadScores(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), { value: [["name 3", "deck 1", 77], ["name 3", "deck 1", 77], ["name 3", "deck 1", 77]] });

    resetScoresForTesting();
    //test 3
    var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/load-scores' });
    var res3 = httpMocks.createResponse();
    loadScores(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), { value: [] });

    resetScoresForTesting();
    resetDecksForTesting();
  });

  it('list', function(){
    resetDecksForTesting();
    //Straight line code
    //test 1
    var saveReq = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "key", value: "deck value" } });
    var saveResp = httpMocks.createResponse();
    saveDeck(saveReq, saveResp);
    var saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "key 2", value: "deck value 2" } });
    var saveResp2 = httpMocks.createResponse();
    saveDeck(saveReq2, saveResp2);
    
    var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    var res1 = httpMocks.createResponse();
    list(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), { decks: ["key", "key 2"] });

    resetDecksForTesting();
    //test 2
    var saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "key 3", value: "deck value 3" } });
    var saveResp3 = httpMocks.createResponse();
    saveDeck(saveReq3, saveResp3);
    var saveReq4 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "key 3", value: "deck value 4" } });
    var saveResp4 = httpMocks.createResponse();
    saveDeck(saveReq4, saveResp4);

    var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    var res2 = httpMocks.createResponse();
    list(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), { decks: ["key 3"] });

    resetDecksForTesting();
    //test 3
    var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/list' });
    var res3 = httpMocks.createResponse();
    list(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), { decks: [] });

    resetDecksForTesting();
  });

  it('checkname', function(){
    //Saving decks for testing
    var sdReq = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 1", value: "deck value" } });
    var sdResp = httpMocks.createResponse();
    saveDeck(sdReq, sdResp);
    var sdReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/save-deck',
        body: { name: "deck 2", value: "deck value 2" } });
    var sdResp2 = httpMocks.createResponse();
    saveDeck(sdReq2, sdResp2);

    //Branch 1: error case
    var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/checkname', query: {} });
    var res1 = httpMocks.createResponse();
    checkName(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/checkname', query: { name: 88 } });
    var res2 = httpMocks.createResponse();
    checkName(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    //Branch 2: Striaght line code
    var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/checkname', query: { name : "deck 2"} });
    var res3 = httpMocks.createResponse();
    checkName(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {value: false});

    var req4 = httpMocks.createRequest({ method: 'GET', url: '/api/checkname', query: { name: "deck 3" } });
    var res4 = httpMocks.createResponse();
    checkName(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {value: true});

    resetDecksForTesting();
  });
});
