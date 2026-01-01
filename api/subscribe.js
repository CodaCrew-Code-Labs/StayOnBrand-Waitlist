export default async function handler(req, res) {
  console.log('=== API CALL STARTED ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  console.log('Email received:', email);

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const listId = process.env.MAILJET_LIST_ID;

  if (!apiKey || !secretKey || !listId) {
    console.log('Missing environment variables');
    return res.status(500).json({ 
      success: false, 
      error: 'Missing environment variables' 
    });
  }

  try {
    // Step 1: Add contact
    const contactResponse = await fetch('https://api.mailjet.com/v3/REST/contact', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: email,
        IsExcludedFromCampaigns: false
      })
    });

    const contactData = await contactResponse.json();
    console.log('Contact creation response:', contactData);

    // Step 2: Add to list
    const listResponse = await fetch(`https://api.mailjet.com/v3/REST/contactslist/${listId}/managecontact`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: email,
        Action: 'addnoforce'
      })
    });

    const listData = await listResponse.json();
    console.log('List subscription response:', listData);

    if (listResponse.ok) {
      console.log('=== SUCCESS ===');
      return res.status(200).json({ success: true });
    } else {
      console.log('=== ERROR ===');
      return res.status(400).json({ success: false, error: listData });
    }
  } catch (error) {
    console.log('=== EXCEPTION ===', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}