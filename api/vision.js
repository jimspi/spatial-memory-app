export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, location } = req.body;
    
    // OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the main objects in this image. Return a JSON array with objects containing 'name', 'confidence' (0-100), and 'description'. Focus on items someone might want to remember the location of."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    const aiResult = await response.json();
    const objects = JSON.parse(aiResult.choices[0].message.content);

    // Store memory in database (using simple JSON for demo)
    const memory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: location,
      objects: objects,
      image: image
    };

    res.status(200).json({
      success: true,
      memory: memory,
      objects: objects
    });

  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message 
    });
  }
}
