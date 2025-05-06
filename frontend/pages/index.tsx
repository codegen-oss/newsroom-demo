import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Container } from '../components/ui/Container';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <Container>
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Typography variant="h1" className="mb-8 text-center">
          News Room
        </Typography>
        
        <Card className="w-full max-w-md p-6 mb-8">
          <Typography variant="h2" className="mb-4">
            Welcome to News Room
          </Typography>
          <Typography variant="body1" className="mb-6">
            A modern news aggregation platform focusing on geopolitics, economy, and technology.
          </Typography>
          <div className="flex space-x-4">
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </Card>
        
        <Typography variant="body2" className="text-center text-neutral-500 dark:text-neutral-400">
          Current theme: {theme}
        </Typography>
      </div>
    </Container>
  );
}

