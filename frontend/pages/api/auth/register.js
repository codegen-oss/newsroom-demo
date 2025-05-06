// This is a mock API endpoint for demonstration purposes
// In a real application, this would connect to a backend server

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, displayName } = req.body;

    // In a real app, this would create a user in the database
    // For demo purposes, we'll just return a success response
    
    // Mock user data
    const user = {
      id: '123',
      email,
      name: displayName,
      tier: 'free',
    };
    
    // Create a mock JWT token
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      })
    )}.DEMO_KEY`;

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}

