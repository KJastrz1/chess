module.exports = {
  async up(db, client) {

    await db.collection('users').updateMany({}, {
      $set: { rankingPlace: null } 
    });
  },

  async down(db, client) {   
    await db.collection('users').updateMany({}, {
      $unset: { rankingPlace: "" }
    });
  }
};
