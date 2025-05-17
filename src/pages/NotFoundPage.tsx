import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')}>Return to Home</Button>
    </div>
  )
}

export default NotFoundPage
