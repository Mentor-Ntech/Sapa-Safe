export default function TestPage() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Test Page</h2>
      <p className="text-muted-foreground">
        If you can see this, the layout is working correctly!
      </p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
        <p className="text-green-800">✅ Layout is working!</p>
      </div>
    </div>
  )
}
