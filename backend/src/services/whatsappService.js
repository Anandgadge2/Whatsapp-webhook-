const axios = require('axios');

const sendMessage = async (to, message) => {
  try {
    const token = process.env.GRAPH_API_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;
    
    if (!token || !phoneId) {
        console.error("Missing GRAPH_API_TOKEN or PHONE_NUMBER_ID");
        return;
    }

    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
    
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message },
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(url, data, config);
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw error;
  }
};

module.exports = {
  sendMessage,
};
