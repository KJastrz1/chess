module.exports = {
  async up(db, client) {

    await db.collection('users').updateMany({}, {
      $set: { eloRating: 1200 } 
    });
  },

  async down(db, client) {   
    await db.collection('users').updateMany({}, {
      $unset: { eloRating: "" }
    });
  }
};
