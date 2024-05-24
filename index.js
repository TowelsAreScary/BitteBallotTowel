const firestore = admin.firestore();

exports.scheduledFunction = functions.pubsub.schedule('every day 09:00').timeZone('America/New_York').onRun(async (context) => {
  console.log('This will be run every day at 9:00 AM Eastern Time!');

  // Get a reference to a Firestore collection
  const docRef = firestore.collection('yourCollection').doc('yourDocument');

  // Fetch data from Firestore (replace with your desired logic)
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    console.log('Document data:', docSnapshot.data());
  } else {
    console.log('No such document!');
  }

  // You can perform actions based on the retrieved data here
  
  return null;
});
