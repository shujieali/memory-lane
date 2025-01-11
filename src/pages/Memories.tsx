import Dashboard from './Dashboard'

// Re-export Dashboard component as Memories
// This allows us to potentially add memory-specific features in the future
// while maintaining the core functionality from Dashboard
export default function Memories() {
  return <Dashboard />
}
