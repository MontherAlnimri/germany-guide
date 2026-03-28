// ============================================================================
// Dashboard footer (minimal)
// ============================================================================

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Germany Guide © {new Date().getFullYear()} — Built for newcomers in Germany
        </p>
      </div>
    </footer>
  );
}