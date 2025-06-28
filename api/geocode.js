export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lat, lng } = req.body;

    // Google Maps Reverse Geocoding
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      // Extract meaningful location components
      const components = result.address_components;
      const locationName = getLocationName(components, result.formatted_address);

      res.status(200).json({
        success: true,
        location: {
          name: locationName,
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          coordinates: { lat, lng },
          types: result.types
        }
      });
    } else {
      res.status(400).json({ 
        error: 'Unable to geocode location',
        status: data.status 
      });
    }

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ 
      error: 'Geocoding failed',
      details: error.message 
    });
  }
}

function getLocationName(components, formatted_address) {
  // Smart location naming logic
  const establishment = components.find(c => c.types.includes('establishment'));
  const premise = components.find(c => c.types.includes('premise'));
  const subpremise = components.find(c => c.types.includes('subpremise'));
  
  if (establishment) {
    return establishment.long_name;
  }
  
  if (premise) {
    let name = premise.long_name;
    if (subpremise) {
      name += ` - ${subpremise.long_name}`;
    }
    return name;
  }

  // Fallback to first few words of formatted address
  return formatted_address.split(',')[0];
}
