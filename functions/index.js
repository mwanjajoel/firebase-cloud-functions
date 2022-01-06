const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Function that adds a message to firestore
 */
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // get the text from the request
  const original = req.query.text;

  // push the text into firestore using firebase admin SDK
  const writeResult = await admin.firestore().collection("messages")
      .add({original: original});

  // send back a response
  res.json({result: `Message with ID: ${writeResult.id} added`});
});

/**
 * Function that uppercases any messages written to firestore
 */
// listens for new messages in the collection and triggers this function
exports.makeUppercase = functions.firestore.document("/messages/{documentId}")
    .onCreate((snap, context) => {
      // get the original text
      const original = snap.data().original;

      //  access the parameter `{documentId}` with context.params.
      functions.logger.log("Uppercasing, ",
          context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // return the promise when writing to firestore
      return snap.ref.set({uppercase}, {merge: true});
    });


