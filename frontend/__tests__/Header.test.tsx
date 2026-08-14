import { render, screen } from '@testing-library/react'
import Header from '../components/Header'
import { ToastProvider } from '../components/ToastProvider'

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

describe('Header', () => {
  it('renders the airbnb logo text', () => {
    render(
      <ToastProvider>
        <Header />
      </ToastProvider>
    )
    const logoText = screen.getByText(/airbnb/i)
    expect(logoText).toBeInTheDocument()
  })

  it('renders the search destinations placeholder', () => {
    render(
      <ToastProvider>
        <Header />
      </ToastProvider>
    )
    const searchWhere = screen.getByText(/Search destinations/i)
    expect(searchWhere).toBeInTheDocument()
  })
})

