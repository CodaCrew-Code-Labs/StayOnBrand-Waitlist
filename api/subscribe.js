export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  // Debug environment variables
  console.log('Environment check:', {
    hasApiKey: !!process.env.MAILJET_API_KEY,
    hasSecretKey: !!process.env.MAILJET_SECRET_KEY,
    hasListId: !!process.env.MAILJET_LIST_ID,
    listId: process.env.MAILJET_LIST_ID
  });

  const apiKey = process.env.MAILJET_API_KEY?.replace(/"/g, '');
  const secretKey = process.env.MAILJET_SECRET_KEY?.replace(/"/g, '');
  const listId = process.env.MAILJET_LIST_ID?.replace(/"/g, '');

  if (!apiKey || !secretKey || !listId) {
    return res.status(500).json({ 
      success: false, 
      error: 'Missing environment variables' 
    });
  }

  try {
    const requestBody = {
      Contacts: [{
        Email: email,
        IsExcludedFromCampaigns: false
      }],
      ContactsLists: [parseInt(listId)]
    };

    console.log('Mailjet request:', requestBody);

    const response = await fetch('https://api.mailjet.com/v3/REST/contact/managemanycontacts', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Mailjet response status:', response.status);
    console.log('Mailjet response text:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      responseData = { error: 'Invalid response from Mailjet', raw: responseText };
    }
    
    if (response.ok) {
      console.log('Mailjet success:', responseData);
      res.status(200).json({ success: true });
    } else {
      console.log('Mailjet error:', response.status, responseData);
      res.status(400).json({ success: false, error: responseData });
    }
  } catch (error) {
    console.log('API error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}