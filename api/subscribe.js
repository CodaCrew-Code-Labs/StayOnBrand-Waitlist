export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const response = await fetch('https://api.mailjet.com/v3/REST/contact/managemanycontacts', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Contacts: [{
          Email: email,
          IsExcludedFromCampaigns: false
        }],
        ContactsLists: [parseInt(process.env.MAILJET_LIST_ID)]
      })
    });

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
}