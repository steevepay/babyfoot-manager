const express = require('express');
const router = express.Router();
const db = require('../api/index')

/* GET babyfoot games list. */
router.get('/games', async (req, res, next) => {
 await db.query(`SELECT * FROM games ORDER BY id ASC`, null, (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
    }
    res.send(result.rows)
  });
});

/* POST new babyfoot game. */
router.post('/games', async (req, res, next) => {
  const { name } = req.body;
  if (!name || name === undefined || name.length === 0) {
    return res.status(400).json({ errors: ['Bad Request - Invalid name'] });
  }
  await db.query('INSERT INTO games (name) VALUES ($1) RETURNING *', [name], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
    }
    res.status(201).send(result.rows)
  });
})

/* PUT Edit one babyfoot game */
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
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ['Game not found.'] });
    }
    res.send(result.rows)
  });
})

/* DELETE all babyfoot games */
router.delete('/games', async (req, res, next) => {
  await db.query(`DELETE FROM games`, null, (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, could not retrieve games...'] });
    }
    res.send(result.rows)
  })
});

/* DELETE one specific babyfoot game */
router.delete('/games/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id) !== false) {
    return res.status(400).json({ errors: ['Invalid game ID supplied...'] });
  }
  await db.query(`DELETE FROM games WHERE id = $1`, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, could not retrieve games...'] });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ['Game not found.'] });
    }
    res.send(result.rows)
  });
});

/* GET game listing. */
router.get('/messages', async (req, res, next) => {
  let page = req.query.page;
  let limit = req.query.limit;
  if (!page || page <= 0 || !limit || limit <=0) {
    return res.status(400).json({ errors: ['Invalid parameters supplied: page or limit.'] });
  }
  let offset = (page - 1) * limit;
  await db.query(`SELECT * FROM messages ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`, null, (err, result) => {
     if (err) {
       return res.status(500).json({ errors: ['Oops, something went wrong...'] });
     }
     res.send(result.rows)
   });
 });

/* POST new message. */
router.post('/messages', async (req, res, next) => {
  const { name, message } = req.body;
  if (!name || name === undefined || name.length === 0) {
    return res.status(400).json({ errors: ['Bad Request - Invalid name'] });
  }
  if (!message || message === undefined || message.length === 0) {
    return res.status(400).json({ errors: ['Bad Request - Invalid message'] });
  }
  await db.query('INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING *', [name, message], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
    }
    res.status(201).send(result.rows)
  });
})

/** Delete all messages from tchat */
router.delete('/messages', async (req, res, next) => {
  await db.query(`DELETE FROM messages`, null, (err, result) => {
    if (err) {
      return res.status(500).json({ errors: ['Oops, something went wrong...'] });
    }
    res.send(result.rows)
  })
});

module.exports = router;
