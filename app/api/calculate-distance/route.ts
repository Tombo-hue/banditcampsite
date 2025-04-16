import { NextResponse } from 'next/server';

interface PostcodeData {
  longitude: number;
  latitude: number;
}

// Function to get coordinates from postcode using postcodes.io
const getPostcodeCoordinates = async (postcode: string): Promise<PostcodeData | null> => {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.result) return null;
    
    return {
      longitude: data.result.longitude,
      latitude: data.result.latitude
    };
  } catch (error) {
    console.error('Error fetching postcode data:', error);
    return null;
  }
};

// Function to calculate road distance using OpenRouteService
const getRoadDistance = async (start: PostcodeData, end: PostcodeData): Promise<number | null> => {
  try {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248949b0fd0d0eb4d4e8f2021d6ad761fd3&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.features?.[0]?.properties?.segments?.[0]?.distance) return null;
    
    // Convert meters to miles
    return Math.round(data.features[0].properties.segments[0].distance / 1609.34);
  } catch (error) {
    console.error('Error calculating road distance:', error);
    return null;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');
    
    if (!postcode) {
      return NextResponse.json({ error: 'Postcode is required' }, { status: 400 });
    }

    // Get coordinates for both postcodes
    const [coords1, coords2] = await Promise.all([
      getPostcodeCoordinates(postcode),
      getPostcodeCoordinates('CH4 8ND')
    ]);

    if (!coords1 || !coords2) {
      return NextResponse.json({ error: 'Could not get coordinates for postcodes' }, { status: 400 });
    }

    // Get road distance
    const roadDistance = await getRoadDistance(coords1, coords2);
    
    if (roadDistance) {
      return NextResponse.json({ distance: roadDistance });
    }

    // Fallback to direct distance if road distance fails
    const R = 3959; // Earth's radius in miles
    const lat1 = coords1.latitude * Math.PI / 180;
    const lat2 = coords2.latitude * Math.PI / 180;
    const dLat = (coords2.latitude - coords1.latitude) * Math.PI / 180;
    const dLon = (coords2.longitude - coords1.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = Math.round(R * c * 1.2); // Add 20% for road routes
    
    return NextResponse.json({ distance: Math.max(distance, 10) });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return NextResponse.json({ error: 'Failed to calculate distance' }, { status: 500 });
  }
} 