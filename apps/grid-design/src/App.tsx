import { Button, Container } from '@repo/ui'
import './App.css'

export default function App() {
  return (
    <Container maxWidth="60rem" style={{ paddingBlock: '4rem' }}>
      <h1>Grid Design</h1>
      <p>A design system playground built on the shared monorepo platform.</p>
      <Button onClick={() => alert('Hello from @repo/ui!')}>Get started</Button>
    </Container>
  )
}
