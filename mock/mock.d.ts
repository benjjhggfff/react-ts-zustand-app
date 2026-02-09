declare module 'mockjs' {
  interface MockRequest {
    url: string
    type: string
    body: string
    headers: Record<string, string>
  }

  const Mock: {
    mock(url: string, type: string, handler: (req: MockRequest) => any): void
    setup(options: { timeout: number }): void
  }

  export default Mock
}
