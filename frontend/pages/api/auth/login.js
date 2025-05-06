// This is a mock API endpoint for demonstration purposes
// In a real application, this would connect to a backend server

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // In a real app, this would validate credentials against a database
    // For demo purposes, we'll accept any credentials
    
    // Mock user data
    const user = {
      id: '123',
      email,
      name: email.split('@')[0],
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

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}

