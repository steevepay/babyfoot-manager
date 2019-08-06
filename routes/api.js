var express = require('express');
var router = express.Router();
const db = require('../api/index')

/* GET game listing. */
router.get('/games', async (req, res, next) => {
 await db.query(`SELECT * FROM games`, null, (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
      // return next(err)
    }
    res.send(result.rows)
  });
});

/* POST new game. */
router.post('/games', async (req, res, next) => {
  const { name } = req.body;
  if (!name || name === undefined || name.length === 0) {
    return res.status(400).json({ errors: ['Bad Request - Invalid name'] });
  }
  await db.query('INSERT INTO games (name) VALUES ($1)', [name], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
      // return next(err)
    }
    res.status(201).json({ success: ['Created!'] })
  });
})

/* PUT home page. */
router.patch('/games/:id', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || isNaN(id) !== false) {
    return res.status(400).json({ errors: ['Invalid game ID supplied...'] });
  }
  if (!status || isNaN(status) !== true || status === undefined || status.length === 0) {
    return res.status(400).json({ errors: ['Invalid game status supplied...'] });
  }
  await db.query(`UPDATE games SET status = $1 WHERE id = $2`, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, could not retrieve games...'] });
      // return next(err)
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ['Game not found.'] });
    }
    res.send(result.rows)
  });
})

/* DELETE home page */
router.delete('/games/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id) !== false) {
    return res.status(400).json({ errors: ['Invalid game ID supplied...'] });
  }
  await db.query(`DELETE FROM games WHERE id = $1`, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, could not retrieve games...'] });
      // return next(err)
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ['Game not found.'] });
    }
    res.send(result.rows)
  });
})


module.exports = router;
