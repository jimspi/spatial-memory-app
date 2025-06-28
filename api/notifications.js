export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, payload } = req.body;
    
    // Web Push using VAPID keys
    const webpush = require('web-push');
    
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    await webpush.sendNotification(subscription, JSON.stringify(payload));

    res.status(200).json({
      success: true,
      message: 'Notification sent'
    });

  } catch (error) {
    console.error('Push notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}
